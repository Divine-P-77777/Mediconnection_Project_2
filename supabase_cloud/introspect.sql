-- ============================================================
-- SUPABASE FULL INTROSPECTION SCRIPT
-- Run this in Supabase SQL Editor to dump your entire schema
-- ============================================================

-- 1️⃣ ALL TABLES (with columns, types, defaults, nullable)
SELECT '--- TABLES ---' AS section;

SELECT 
  t.table_schema,
  t.table_name,
  c.column_name,
  c.data_type,
  c.column_default,
  c.is_nullable,
  c.character_maximum_length
FROM information_schema.tables t
JOIN information_schema.columns c 
  ON t.table_name = c.table_name 
  AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;

-- 2️⃣ PRIMARY KEYS & UNIQUE CONSTRAINTS
SELECT '--- CONSTRAINTS ---' AS section;

SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;

-- 3️⃣ FOREIGN KEYS
SELECT '--- FOREIGN KEYS ---' AS section;

SELECT
  tc.table_name AS from_table,
  kcu.column_name AS from_column,
  ccu.table_name AS to_table,
  ccu.column_name AS to_column,
  tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4️⃣ RLS POLICIES
SELECT '--- RLS POLICIES ---' AS section;

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5️⃣ RLS STATUS (is it enabled per table?)
SELECT '--- RLS ENABLED STATUS ---' AS section;

SELECT 
  relname AS table_name,
  relrowsecurity AS rls_enabled,
  relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relkind = 'r'
ORDER BY relname;

-- 6️⃣ FUNCTIONS
SELECT '--- FUNCTIONS ---' AS section;

SELECT 
  routine_name,
  routine_type,
  data_type AS return_type,
  external_language AS language
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 7️⃣ TRIGGERS
SELECT '--- TRIGGERS ---' AS section;

SELECT 
  trigger_name,
  event_manipulation AS event,
  event_object_table AS table_name,
  action_timing AS timing,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 8️⃣ STORAGE BUCKETS
SELECT '--- STORAGE BUCKETS ---' AS section;

SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
ORDER BY name;

-- 9️⃣ STORAGE POLICIES
SELECT '--- STORAGE POLICIES ---' AS section;

SELECT
  policyname,
  tablename,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- 🔟 INDEXES
SELECT '--- INDEXES ---' AS section;

SELECT
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 1️⃣1️⃣ ENUMS / CUSTOM TYPES
SELECT '--- CUSTOM TYPES & ENUMS ---' AS section;

SELECT 
  t.typname AS type_name,
  e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
ORDER BY t.typname, e.enumsortorder;

-- 1️⃣2️⃣ VIEWS
SELECT '--- VIEWS ---' AS section;

SELECT 
  table_name AS view_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;
