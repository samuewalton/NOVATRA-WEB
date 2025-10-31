# הרצת סקריפט אתחול מסד הנתונים

הסקריפט נוצר אבל הוא דורש חיבור אינטרנט. אני לא יכול להריץ אותו מכאן בגלל הגבלות רשת.

## פתרון פשוט - הרץ במחשב שלך:

```bash
# 1. משוך את השינויים האחרונים
git pull origin claude/vercel-git-integration-011CUfn6HomKyNGV5p7JLJf9

# 2. הרץ את הסקריפט
node scripts/init-db.mjs
```

זה הכל! הסקריפט יצור את כל 6 הטבלאות אוטומטית.

## אם זה לא עובד - העתק SQL ידנית:

לך ל: https://supabase.com/dashboard/project/wfxzxgabfzpishuhzejh/sql/new

והעתק את כל ה-SQL מהקובץ `DATABASE_SCHEMA.md`
