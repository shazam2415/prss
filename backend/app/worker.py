import feedparser
import requests
import os
from sqlalchemy.orm import Session
from datetime import datetime
from .models.feed import Feed
from .models.article import Article
from dateutil import parser as date_parser

def send_telegram_notification(feed_title: str, new_articles: list):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    
    if not bot_token or not chat_id or not new_articles:
        return

    message = f"📰 <b>New articles in {feed_title}</b>\n\n"
    for idx, article in enumerate(new_articles[:5]): # Limit to 5 per message to avoid huge texts
        message += f"• <a href='{article['link']}'>{article['title']}</a>\n"
    
    if len(new_articles) > 5:
        message += f"\n<i>...and {len(new_articles) - 5} more.</i>"

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }
    
    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"Failed to send telegram notification: {e}")

def fetch_feed_articles(db: Session, feed_id: int):
    db_feed = db.query(Feed).filter(Feed.id == feed_id).first()
    if not db_feed:
        return

    parsed_feed = feedparser.parse(db_feed.url)
    new_articles_list = []
    
    for entry in parsed_feed.entries:
        # Check if article already exists
        existing_article = db.query(Article).filter(Article.link == entry.link).first()
        if existing_article:
            continue

        # Parse publication date
        pub_date = None
        if hasattr(entry, 'published'):
            try:
                pub_date = date_parser.parse(entry.published)
            except:
                pass
        
        # Get content/description
        description = entry.summary if hasattr(entry, 'summary') else None
        content = entry.content[0].value if hasattr(entry, 'content') else None

        db_article = Article(
            feed_id=db_feed.id,
            title=entry.title,
            link=entry.link,
            description=description,
            content=content,
            author=entry.author if hasattr(entry, 'author') else None,
            published_at=pub_date
        )
        db.add(db_article)
        new_articles_list.append({"title": entry.title, "link": entry.link})

    db_feed.last_fetched_at = datetime.now()
    db.commit()
    
    if new_articles_list:
        send_telegram_notification(db_feed.title, new_articles_list)

