import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_use_cases_stage" AS ENUM('concept', 'pilot', 'deployed', 'scaled', 'discontinued');
  CREATE TYPE "public"."enum_use_cases_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_use_cases_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__use_cases_v_version_stage" AS ENUM('concept', 'pilot', 'deployed', 'scaled', 'discontinued');
  CREATE TYPE "public"."enum__use_cases_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__use_cases_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__use_cases_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_publications_type" AS ENUM('report', 'mapping-study', 'annual-report', 'research-brief', 'policy-brief', 'innovation-brief', 'toolkit', 'comparative-analysis');
  CREATE TYPE "public"."enum_publications_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_publications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publications_v_version_type" AS ENUM('report', 'mapping-study', 'annual-report', 'research-brief', 'policy-brief', 'innovation-brief', 'toolkit', 'comparative-analysis');
  CREATE TYPE "public"."enum__publications_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__publications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publications_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_datasets_licence" AS ENUM('cc-by-4', 'cc-by-sa-4', 'cc0', 'odc', 'restricted', 'other');
  CREATE TYPE "public"."enum_datasets_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_datasets_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__datasets_v_version_licence" AS ENUM('cc-by-4', 'cc-by-sa-4', 'cc0', 'odc', 'restricted', 'other');
  CREATE TYPE "public"."enum__datasets_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__datasets_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__datasets_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_indicators_value_type" AS ENUM('number', 'percent', 'status');
  CREATE TYPE "public"."enum_indicators_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_indicator_values_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_posts_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_op_eds_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_op_eds_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__op_eds_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__op_eds_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__op_eds_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_news_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_people_affiliation" AS ENUM('team', 'partner', 'expert', 'contributor', 'advisory');
  CREATE TYPE "public"."enum_people_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_people_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_version_affiliation" AS ENUM('team', 'partner', 'expert', 'contributor', 'advisory');
  CREATE TYPE "public"."enum__people_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__people_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_organisations_observatory_role" AS ENUM('lead', 'partner', 'funder', 'member', 'profiled');
  CREATE TYPE "public"."enum_organisations_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_organisations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__organisations_v_version_observatory_role" AS ENUM('lead', 'partner', 'funder', 'member', 'profiled');
  CREATE TYPE "public"."enum__organisations_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__organisations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__organisations_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_events_format" AS ENUM('online', 'in-person', 'hybrid');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('dialogue', 'webinar', 'workshop', 'convening', 'scopeathon', 'cop');
  CREATE TYPE "public"."enum_events_registration_mode" AS ENUM('none', 'form', 'external');
  CREATE TYPE "public"."enum_events_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_format" AS ENUM('online', 'in-person', 'hybrid');
  CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('dialogue', 'webinar', 'workshop', 'convening', 'scopeathon', 'cop');
  CREATE TYPE "public"."enum__events_v_version_registration_mode" AS ENUM('none', 'form', 'external');
  CREATE TYPE "public"."enum__events_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_learning_resources_resource_type" AS ENUM('course', 'video', 'toolkit', 'guide', 'framework', 'reading-list');
  CREATE TYPE "public"."enum_learning_resources_level" AS ENUM('introductory', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_learning_resources_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_learning_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__learning_resources_v_version_resource_type" AS ENUM('course', 'video', 'toolkit', 'guide', 'framework', 'reading-list');
  CREATE TYPE "public"."enum__learning_resources_v_version_level" AS ENUM('introductory', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum__learning_resources_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__learning_resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__learning_resources_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_opportunities_opportunity_type" AS ENUM('fellowship', 'grant', 'programme', 'call-for-papers', 'job', 'competition', 'event');
  CREATE TYPE "public"."enum_opportunities_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_opportunities_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__opportunities_v_version_opportunity_type" AS ENUM('fellowship', 'grant', 'programme', 'call-for-papers', 'job', 'competition', 'event');
  CREATE TYPE "public"."enum__opportunities_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__opportunities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__opportunities_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_newsletters_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_newsletters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__newsletters_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__newsletters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__newsletters_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_pages_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_provenance" AS ENUM('sample', 'public', 'client');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_countries_subregion" AS ENUM('south-asia', 'southeast-asia');
  CREATE TYPE "public"."enum_subscribers_status" AS ENUM('pending', 'subscribed', 'unsubscribed');
  CREATE TYPE "public"."enum_event_registrations_status" AS ENUM('registered', 'waitlisted', 'cancelled');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'contributor');
  CREATE TYPE "public"."enum_media_access" AS ENUM('open', 'gated');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'en');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'purge-expired-records', 'createCollectionExport', 'createCollectionImport', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'purge-expired-records', 'createCollectionExport', 'createCollectionImport', 'schedulePublish');
  CREATE TABLE "use_cases_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "use_cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"stage" "enum_use_cases_stage",
  	"year_started" numeric,
  	"problem" varchar,
  	"responsible_ai_practices" varchar,
  	"evidence_of_impact" varchar,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_use_cases_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_use_cases_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "use_cases_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"organisations_id" integer,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"rai_dimensions_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_use_cases_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_use_cases_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_stage" "enum__use_cases_v_version_stage",
  	"version_year_started" numeric,
  	"version_problem" varchar,
  	"version_responsible_ai_practices" varchar,
  	"version_evidence_of_impact" varchar,
  	"version_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__use_cases_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__use_cases_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__use_cases_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_use_cases_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"organisations_id" integer,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"rai_dimensions_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"type" "enum_publications_type",
  	"summary" varchar,
  	"abstract" jsonb,
  	"author_text" varchar,
  	"file_id" integer,
  	"external_url" varchar,
  	"citation" varchar,
  	"pages" numeric,
  	"cover_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_publications_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_publications_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "publications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"organisations_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"rai_dimensions_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_publications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__publications_v_version_type",
  	"version_summary" varchar,
  	"version_abstract" jsonb,
  	"version_author_text" varchar,
  	"version_file_id" integer,
  	"version_external_url" varchar,
  	"version_citation" varchar,
  	"version_pages" numeric,
  	"version_cover_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__publications_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__publications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__publications_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_publications_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"organisations_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"rai_dimensions_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "datasets_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "datasets_access_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "datasets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"source" varchar,
  	"method_notes" varchar,
  	"temporal_coverage" varchar,
  	"update_frequency" varchar,
  	"licence" "enum_datasets_licence",
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_datasets_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_datasets_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "datasets_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"indicators_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_datasets_v_version_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_datasets_v_version_access_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_datasets_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_source" varchar,
  	"version_method_notes" varchar,
  	"version_temporal_coverage" varchar,
  	"version_update_frequency" varchar,
  	"version_licence" "enum__datasets_v_version_licence",
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__datasets_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__datasets_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__datasets_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_datasets_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"indicators_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "indicators_status_labels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" numeric,
  	"label" varchar
  );
  
  CREATE TABLE "indicators" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"definition" varchar NOT NULL,
  	"unit" varchar NOT NULL,
  	"value_type" "enum_indicators_value_type" DEFAULT 'number' NOT NULL,
  	"min" numeric,
  	"max" numeric,
  	"higher_is_better" boolean DEFAULT true,
  	"enabler_id" integer,
  	"source" varchar NOT NULL,
  	"source_url" varchar,
  	"methodology" varchar,
  	"dataset_id" integer,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"provenance" "enum_indicators_provenance" DEFAULT 'sample',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "indicators_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer
  );
  
  CREATE TABLE "indicator_values" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"indicator_id" integer NOT NULL,
  	"country_id" integer NOT NULL,
  	"year" numeric NOT NULL,
  	"value" numeric NOT NULL,
  	"note" varchar,
  	"source_url" varchar,
  	"provenance" "enum_indicator_values_provenance" DEFAULT 'sample',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"author_text" varchar,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_posts_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_author_text" varchar,
  	"version_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__posts_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "op_eds" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"outlet" varchar,
  	"external_url" varchar,
  	"author_text" varchar,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_op_eds_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_op_eds_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "op_eds_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_op_eds_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_outlet" varchar,
  	"version_external_url" varchar,
  	"version_author_text" varchar,
  	"version_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__op_eds_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__op_eds_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__op_eds_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_op_eds_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"author_text" varchar,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_news_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_author_text" varchar,
  	"version_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__news_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "people_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"role" varchar,
  	"organisation_id" integer,
  	"affiliation" "enum_people_affiliation",
  	"summary" varchar,
  	"bio" jsonb,
  	"photo_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_people_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_people_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "people_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer,
  	"countries_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_people_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_people_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_role" varchar,
  	"version_organisation_id" integer,
  	"version_affiliation" "enum__people_v_version_affiliation",
  	"version_summary" varchar,
  	"version_bio" jsonb,
  	"version_photo_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__people_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__people_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__people_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_people_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer,
  	"countries_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "organisations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"acronym" varchar,
  	"stakeholder_type_id" integer,
  	"observatory_role" "enum_organisations_observatory_role" DEFAULT 'profiled',
  	"summary" varchar,
  	"description" jsonb,
  	"website" varchar,
  	"logo_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_organisations_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_organisations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "organisations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_organisations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_acronym" varchar,
  	"version_stakeholder_type_id" integer,
  	"version_observatory_role" "enum__organisations_v_version_observatory_role" DEFAULT 'profiled',
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_website" varchar,
  	"version_logo_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__organisations_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__organisations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__organisations_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_organisations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"timezone" varchar DEFAULT 'Asia/Colombo',
  	"format" "enum_events_format",
  	"event_type" "enum_events_event_type",
  	"venue" varchar,
  	"online_url" varchar,
  	"registration_mode" "enum_events_registration_mode" DEFAULT 'none',
  	"registration_external_url" varchar,
  	"registration_closes_at" timestamp(3) with time zone,
  	"registration_capacity" numeric,
  	"recording_url" varchar,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_events_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"organisations_id" integer,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_timezone" varchar DEFAULT 'Asia/Colombo',
  	"version_format" "enum__events_v_version_format",
  	"version_event_type" "enum__events_v_version_event_type",
  	"version_venue" varchar,
  	"version_online_url" varchar,
  	"version_registration_mode" "enum__events_v_version_registration_mode" DEFAULT 'none',
  	"version_registration_external_url" varchar,
  	"version_registration_closes_at" timestamp(3) with time zone,
  	"version_registration_capacity" numeric,
  	"version_recording_url" varchar,
  	"version_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__events_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"organisations_id" integer,
  	"people_id" integer,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "learning_resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"resource_type" "enum_learning_resources_resource_type",
  	"level" "enum_learning_resources_level",
  	"duration" varchar,
  	"provider" varchar,
  	"provider_organisation_id" integer,
  	"external_url" varchar,
  	"file_id" integer,
  	"video_embed_url" varchar,
  	"language" varchar DEFAULT 'English',
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_learning_resources_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_learning_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "learning_resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"rai_dimensions_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_learning_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_resource_type" "enum__learning_resources_v_version_resource_type",
  	"version_level" "enum__learning_resources_v_version_level",
  	"version_duration" varchar,
  	"version_provider" varchar,
  	"version_provider_organisation_id" integer,
  	"version_external_url" varchar,
  	"version_file_id" integer,
  	"version_video_embed_url" varchar,
  	"version_language" varchar DEFAULT 'English',
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__learning_resources_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__learning_resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__learning_resources_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_learning_resources_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"rai_dimensions_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "opportunities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"opportunity_type" "enum_opportunities_opportunity_type",
  	"deadline" timestamp(3) with time zone,
  	"rolling" boolean DEFAULT false,
  	"provider" varchar,
  	"eligibility" varchar,
  	"external_url" varchar,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_opportunities_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_opportunities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "opportunities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_opportunities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_opportunity_type" "enum__opportunities_v_version_opportunity_type",
  	"version_deadline" timestamp(3) with time zone,
  	"version_rolling" boolean DEFAULT false,
  	"version_provider" varchar,
  	"version_eligibility" varchar,
  	"version_external_url" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__opportunities_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__opportunities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__opportunities_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_opportunities_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "newsletters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"issue_number" numeric,
  	"summary" varchar,
  	"body" jsonb,
  	"pdf_id" integer,
  	"external_url" varchar,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_newsletters_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_newsletters_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "newsletters_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"events_id" integer,
  	"posts_id" integer,
  	"opportunities_id" integer
  );
  
  CREATE TABLE "_newsletters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_issue_number" numeric,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_pdf_id" integer,
  	"version_external_url" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__newsletters_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__newsletters_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__newsletters_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_newsletters_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"events_id" integer,
  	"posts_id" integer,
  	"opportunities_id" integer
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"provenance" "enum_pages_provenance" DEFAULT 'sample',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_provenance" "enum__pages_v_version_provenance" DEFAULT 'sample',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"iso3" varchar NOT NULL,
  	"iso_numeric" varchar NOT NULL,
  	"subregion" "enum_countries_subregion" NOT NULL,
  	"small_state" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enablers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rai_dimensions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stakeholder_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "download_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"file_id" integer NOT NULL,
  	"resource_title" varchar,
  	"resource_url" varchar,
  	"organisation" varchar,
  	"country" varchar,
  	"consent_text" varchar NOT NULL,
  	"consent_version" varchar NOT NULL,
  	"ip_hash" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"organisation" varchar,
  	"status" "enum_subscribers_status" DEFAULT 'pending' NOT NULL,
  	"provider" varchar,
  	"provider_id" varchar,
  	"consent_text" varchar NOT NULL,
  	"consent_version" varchar NOT NULL,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer
  );
  
  CREATE TABLE "event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"organisation" varchar,
  	"country" varchar,
  	"stakeholder_type_id" integer,
  	"accessibility_needs" varchar,
  	"consent_text" varchar NOT NULL,
  	"consent_version" varchar NOT NULL,
  	"status" "enum_event_registrations_status" DEFAULT 'registered',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'contributor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"access" "enum_media_access" DEFAULT 'open' NOT NULL,
  	"gate_purpose" varchar DEFAULT 'We ask for your email address so we can tell you when this resource is updated and to understand who uses the Observatory. We do not share it.',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"excerpt" varchar,
  	"keywords" varchar,
  	"type_label" varchar,
  	"path" varchar,
  	"countries" varchar,
  	"topics" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"posts_id" integer,
  	"op_eds_id" integer,
  	"news_id" integer,
  	"people_id" integer,
  	"organisations_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"opportunities_id" integer,
  	"newsletters_id" integer,
  	"indicators_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'download-requests' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar DEFAULT 'use-cases' NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"indicators_id" integer,
  	"indicator_values_id" integer,
  	"posts_id" integer,
  	"op_eds_id" integer,
  	"news_id" integer,
  	"people_id" integer,
  	"organisations_id" integer,
  	"events_id" integer,
  	"learning_resources_id" integer,
  	"opportunities_id" integer,
  	"newsletters_id" integer,
  	"pages_id" integer,
  	"countries_id" integer,
  	"topics_id" integer,
  	"enablers_id" integer,
  	"rai_dimensions_id" integer,
  	"stakeholder_types_id" integer,
  	"tags_id" integer,
  	"download_requests_id" integer,
  	"subscribers_id" integer,
  	"event_registrations_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"search_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_funders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "site_settings_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Asia AI4D Observatory' NOT NULL,
  	"tagline" varchar DEFAULT 'A policy and innovation network on responsible artificial intelligence',
  	"description" varchar DEFAULT 'Evidence, use cases, data and community for responsible AI in South and Southeast Asia.',
  	"contact_email" varchar,
  	"programme_note" varchar DEFAULT 'The Asia AI4D Observatory is led by LIRNEasia with East-West Management Institute and JustJobs Network, with EngageMedia as a project partner. It is part of the Artificial Intelligence for Development (AI4D) programme, a partnership between IDRC and the UK Foreign, Commonwealth and Development Office.',
  	"show_prototype_notices" boolean DEFAULT true,
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_text" varchar,
  	"announcement_url" varchar,
  	"consent_version" varchar DEFAULT '2026-09-v1' NOT NULL,
  	"newsletter_consent_text" varchar DEFAULT 'I agree to receive the Asia AI4D Observatory newsletter and occasional updates about its events and resources. I can unsubscribe at any time.' NOT NULL,
  	"download_consent_text" varchar DEFAULT 'I agree that the Observatory may store my email address to send me updates about this resource and to report anonymised usage to its funders.' NOT NULL,
  	"registration_consent_text" varchar DEFAULT 'I agree that the Observatory may store my details to manage my participation in this event and contact me about it.' NOT NULL,
  	"retention_months" numeric DEFAULT 24,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_audience_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar DEFAULT 'Evidence for responsible AI in Asia' NOT NULL,
  	"intro" varchar DEFAULT 'The Asia AI4D Observatory maps how South and Southeast Asia design, govern and scale AI that is safe, rights-based, sustainable, inclusive and appropriate to context. Find use cases, mapping studies, data, people and opportunities in one place.' NOT NULL,
  	"featured_indicator_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"use_cases_id" integer,
  	"publications_id" integer,
  	"datasets_id" integer,
  	"events_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "use_cases_links" ADD CONSTRAINT "use_cases_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases" ADD CONSTRAINT "use_cases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_cases" ADD CONSTRAINT "use_cases_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_rai_dimensions_fk" FOREIGN KEY ("rai_dimensions_id") REFERENCES "public"."rai_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_version_links" ADD CONSTRAINT "_use_cases_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_use_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v" ADD CONSTRAINT "_use_cases_v_parent_id_use_cases_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."use_cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_cases_v" ADD CONSTRAINT "_use_cases_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_cases_v" ADD CONSTRAINT "_use_cases_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_use_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_rai_dimensions_fk" FOREIGN KEY ("rai_dimensions_id") REFERENCES "public"."rai_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_v_rels" ADD CONSTRAINT "_use_cases_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_rai_dimensions_fk" FOREIGN KEY ("rai_dimensions_id") REFERENCES "public"."rai_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_parent_id_publications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_rai_dimensions_fk" FOREIGN KEY ("rai_dimensions_id") REFERENCES "public"."rai_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_files" ADD CONSTRAINT "datasets_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "datasets_files" ADD CONSTRAINT "datasets_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_access_links" ADD CONSTRAINT "datasets_access_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets" ADD CONSTRAINT "datasets_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_indicators_fk" FOREIGN KEY ("indicators_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "datasets_rels" ADD CONSTRAINT "datasets_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_version_files" ADD CONSTRAINT "_datasets_v_version_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_datasets_v_version_files" ADD CONSTRAINT "_datasets_v_version_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_datasets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_version_access_links" ADD CONSTRAINT "_datasets_v_version_access_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_datasets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v" ADD CONSTRAINT "_datasets_v_parent_id_datasets_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."datasets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_datasets_v" ADD CONSTRAINT "_datasets_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_datasets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_indicators_fk" FOREIGN KEY ("indicators_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_datasets_v_rels" ADD CONSTRAINT "_datasets_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "indicators_status_labels" ADD CONSTRAINT "indicators_status_labels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "indicators" ADD CONSTRAINT "indicators_enabler_id_enablers_id_fk" FOREIGN KEY ("enabler_id") REFERENCES "public"."enablers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "indicators" ADD CONSTRAINT "indicators_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "indicators_rels" ADD CONSTRAINT "indicators_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "indicators_rels" ADD CONSTRAINT "indicators_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "indicator_values" ADD CONSTRAINT "indicator_values_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "indicator_values" ADD CONSTRAINT "indicator_values_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds" ADD CONSTRAINT "op_eds_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "op_eds" ADD CONSTRAINT "op_eds_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."op_eds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "op_eds_rels" ADD CONSTRAINT "op_eds_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v" ADD CONSTRAINT "_op_eds_v_parent_id_op_eds_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."op_eds"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_op_eds_v" ADD CONSTRAINT "_op_eds_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_op_eds_v" ADD CONSTRAINT "_op_eds_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_op_eds_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_op_eds_v_rels" ADD CONSTRAINT "_op_eds_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_links" ADD CONSTRAINT "people_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v_version_links" ADD CONSTRAINT "_people_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_people_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_organisation_id_organisations_id_fk" FOREIGN KEY ("version_organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v_rels" ADD CONSTRAINT "_people_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_people_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v_rels" ADD CONSTRAINT "_people_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v_rels" ADD CONSTRAINT "_people_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v_rels" ADD CONSTRAINT "_people_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v_rels" ADD CONSTRAINT "_people_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organisations" ADD CONSTRAINT "organisations_stakeholder_type_id_stakeholder_types_id_fk" FOREIGN KEY ("stakeholder_type_id") REFERENCES "public"."stakeholder_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organisations" ADD CONSTRAINT "organisations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organisations" ADD CONSTRAINT "organisations_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organisations_rels" ADD CONSTRAINT "organisations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organisations_rels" ADD CONSTRAINT "organisations_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organisations_rels" ADD CONSTRAINT "organisations_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organisations_rels" ADD CONSTRAINT "organisations_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organisations_rels" ADD CONSTRAINT "organisations_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organisations_v" ADD CONSTRAINT "_organisations_v_parent_id_organisations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organisations_v" ADD CONSTRAINT "_organisations_v_version_stakeholder_type_id_stakeholder_types_id_fk" FOREIGN KEY ("version_stakeholder_type_id") REFERENCES "public"."stakeholder_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organisations_v" ADD CONSTRAINT "_organisations_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organisations_v" ADD CONSTRAINT "_organisations_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organisations_v_rels" ADD CONSTRAINT "_organisations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_organisations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organisations_v_rels" ADD CONSTRAINT "_organisations_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organisations_v_rels" ADD CONSTRAINT "_organisations_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organisations_v_rels" ADD CONSTRAINT "_organisations_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organisations_v_rels" ADD CONSTRAINT "_organisations_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources" ADD CONSTRAINT "learning_resources_provider_organisation_id_organisations_id_fk" FOREIGN KEY ("provider_organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "learning_resources" ADD CONSTRAINT "learning_resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "learning_resources" ADD CONSTRAINT "learning_resources_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_rai_dimensions_fk" FOREIGN KEY ("rai_dimensions_id") REFERENCES "public"."rai_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_resources_rels" ADD CONSTRAINT "learning_resources_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v" ADD CONSTRAINT "_learning_resources_v_parent_id_learning_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."learning_resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_learning_resources_v" ADD CONSTRAINT "_learning_resources_v_version_provider_organisation_id_organisations_id_fk" FOREIGN KEY ("version_provider_organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_learning_resources_v" ADD CONSTRAINT "_learning_resources_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_learning_resources_v" ADD CONSTRAINT "_learning_resources_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_learning_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_rai_dimensions_fk" FOREIGN KEY ("rai_dimensions_id") REFERENCES "public"."rai_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learning_resources_v_rels" ADD CONSTRAINT "_learning_resources_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "opportunities_rels" ADD CONSTRAINT "opportunities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "opportunities_rels" ADD CONSTRAINT "opportunities_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "opportunities_rels" ADD CONSTRAINT "opportunities_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "opportunities_rels" ADD CONSTRAINT "opportunities_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "opportunities_rels" ADD CONSTRAINT "opportunities_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_opportunities_v" ADD CONSTRAINT "_opportunities_v_parent_id_opportunities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_opportunities_v" ADD CONSTRAINT "_opportunities_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_opportunities_v_rels" ADD CONSTRAINT "_opportunities_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_opportunities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_opportunities_v_rels" ADD CONSTRAINT "_opportunities_v_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_opportunities_v_rels" ADD CONSTRAINT "_opportunities_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_opportunities_v_rels" ADD CONSTRAINT "_opportunities_v_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_opportunities_v_rels" ADD CONSTRAINT "_opportunities_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_parent_id_newsletters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."newsletters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_newsletters_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "download_requests" ADD CONSTRAINT "download_requests_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscribers_rels" ADD CONSTRAINT "subscribers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscribers_rels" ADD CONSTRAINT "subscribers_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_stakeholder_type_id_stakeholder_types_id_fk" FOREIGN KEY ("stakeholder_type_id") REFERENCES "public"."stakeholder_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_op_eds_fk" FOREIGN KEY ("op_eds_id") REFERENCES "public"."op_eds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_newsletters_fk" FOREIGN KEY ("newsletters_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_indicators_fk" FOREIGN KEY ("indicators_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_indicators_fk" FOREIGN KEY ("indicators_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_indicator_values_fk" FOREIGN KEY ("indicator_values_id") REFERENCES "public"."indicator_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_op_eds_fk" FOREIGN KEY ("op_eds_id") REFERENCES "public"."op_eds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_learning_resources_fk" FOREIGN KEY ("learning_resources_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletters_fk" FOREIGN KEY ("newsletters_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enablers_fk" FOREIGN KEY ("enablers_id") REFERENCES "public"."enablers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rai_dimensions_fk" FOREIGN KEY ("rai_dimensions_id") REFERENCES "public"."rai_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stakeholder_types_fk" FOREIGN KEY ("stakeholder_types_id") REFERENCES "public"."stakeholder_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_download_requests_fk" FOREIGN KEY ("download_requests_id") REFERENCES "public"."download_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_funders" ADD CONSTRAINT "site_settings_funders_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_funders" ADD CONSTRAINT "site_settings_funders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_partners" ADD CONSTRAINT "site_settings_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_partners" ADD CONSTRAINT "site_settings_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_audience_entries" ADD CONSTRAINT "home_audience_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_featured_indicator_id_indicators_id_fk" FOREIGN KEY ("featured_indicator_id") REFERENCES "public"."indicators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_datasets_fk" FOREIGN KEY ("datasets_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "use_cases_links_order_idx" ON "use_cases_links" USING btree ("_order");
  CREATE INDEX "use_cases_links_parent_id_idx" ON "use_cases_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "use_cases_slug_idx" ON "use_cases" USING btree ("slug");
  CREATE INDEX "use_cases_image_idx" ON "use_cases" USING btree ("image_id");
  CREATE INDEX "use_cases_seo_seo_image_idx" ON "use_cases" USING btree ("seo_image_id");
  CREATE INDEX "use_cases_updated_at_idx" ON "use_cases" USING btree ("updated_at");
  CREATE INDEX "use_cases_created_at_idx" ON "use_cases" USING btree ("created_at");
  CREATE INDEX "use_cases_deleted_at_idx" ON "use_cases" USING btree ("deleted_at");
  CREATE INDEX "use_cases__status_idx" ON "use_cases" USING btree ("_status");
  CREATE INDEX "use_cases_rels_order_idx" ON "use_cases_rels" USING btree ("order");
  CREATE INDEX "use_cases_rels_parent_idx" ON "use_cases_rels" USING btree ("parent_id");
  CREATE INDEX "use_cases_rels_path_idx" ON "use_cases_rels" USING btree ("path");
  CREATE INDEX "use_cases_rels_organisations_id_idx" ON "use_cases_rels" USING btree ("organisations_id");
  CREATE INDEX "use_cases_rels_people_id_idx" ON "use_cases_rels" USING btree ("people_id");
  CREATE INDEX "use_cases_rels_use_cases_id_idx" ON "use_cases_rels" USING btree ("use_cases_id");
  CREATE INDEX "use_cases_rels_publications_id_idx" ON "use_cases_rels" USING btree ("publications_id");
  CREATE INDEX "use_cases_rels_datasets_id_idx" ON "use_cases_rels" USING btree ("datasets_id");
  CREATE INDEX "use_cases_rels_events_id_idx" ON "use_cases_rels" USING btree ("events_id");
  CREATE INDEX "use_cases_rels_learning_resources_id_idx" ON "use_cases_rels" USING btree ("learning_resources_id");
  CREATE INDEX "use_cases_rels_countries_id_idx" ON "use_cases_rels" USING btree ("countries_id");
  CREATE INDEX "use_cases_rels_topics_id_idx" ON "use_cases_rels" USING btree ("topics_id");
  CREATE INDEX "use_cases_rels_rai_dimensions_id_idx" ON "use_cases_rels" USING btree ("rai_dimensions_id");
  CREATE INDEX "use_cases_rels_enablers_id_idx" ON "use_cases_rels" USING btree ("enablers_id");
  CREATE INDEX "use_cases_rels_tags_id_idx" ON "use_cases_rels" USING btree ("tags_id");
  CREATE INDEX "_use_cases_v_version_links_order_idx" ON "_use_cases_v_version_links" USING btree ("_order");
  CREATE INDEX "_use_cases_v_version_links_parent_id_idx" ON "_use_cases_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_use_cases_v_parent_idx" ON "_use_cases_v" USING btree ("parent_id");
  CREATE INDEX "_use_cases_v_version_version_slug_idx" ON "_use_cases_v" USING btree ("version_slug");
  CREATE INDEX "_use_cases_v_version_version_image_idx" ON "_use_cases_v" USING btree ("version_image_id");
  CREATE INDEX "_use_cases_v_version_seo_version_seo_image_idx" ON "_use_cases_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_use_cases_v_version_version_updated_at_idx" ON "_use_cases_v" USING btree ("version_updated_at");
  CREATE INDEX "_use_cases_v_version_version_created_at_idx" ON "_use_cases_v" USING btree ("version_created_at");
  CREATE INDEX "_use_cases_v_version_version_deleted_at_idx" ON "_use_cases_v" USING btree ("version_deleted_at");
  CREATE INDEX "_use_cases_v_version_version__status_idx" ON "_use_cases_v" USING btree ("version__status");
  CREATE INDEX "_use_cases_v_created_at_idx" ON "_use_cases_v" USING btree ("created_at");
  CREATE INDEX "_use_cases_v_updated_at_idx" ON "_use_cases_v" USING btree ("updated_at");
  CREATE INDEX "_use_cases_v_snapshot_idx" ON "_use_cases_v" USING btree ("snapshot");
  CREATE INDEX "_use_cases_v_published_locale_idx" ON "_use_cases_v" USING btree ("published_locale");
  CREATE INDEX "_use_cases_v_latest_idx" ON "_use_cases_v" USING btree ("latest");
  CREATE INDEX "_use_cases_v_autosave_idx" ON "_use_cases_v" USING btree ("autosave");
  CREATE INDEX "_use_cases_v_rels_order_idx" ON "_use_cases_v_rels" USING btree ("order");
  CREATE INDEX "_use_cases_v_rels_parent_idx" ON "_use_cases_v_rels" USING btree ("parent_id");
  CREATE INDEX "_use_cases_v_rels_path_idx" ON "_use_cases_v_rels" USING btree ("path");
  CREATE INDEX "_use_cases_v_rels_organisations_id_idx" ON "_use_cases_v_rels" USING btree ("organisations_id");
  CREATE INDEX "_use_cases_v_rels_people_id_idx" ON "_use_cases_v_rels" USING btree ("people_id");
  CREATE INDEX "_use_cases_v_rels_use_cases_id_idx" ON "_use_cases_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_use_cases_v_rels_publications_id_idx" ON "_use_cases_v_rels" USING btree ("publications_id");
  CREATE INDEX "_use_cases_v_rels_datasets_id_idx" ON "_use_cases_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_use_cases_v_rels_events_id_idx" ON "_use_cases_v_rels" USING btree ("events_id");
  CREATE INDEX "_use_cases_v_rels_learning_resources_id_idx" ON "_use_cases_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_use_cases_v_rels_countries_id_idx" ON "_use_cases_v_rels" USING btree ("countries_id");
  CREATE INDEX "_use_cases_v_rels_topics_id_idx" ON "_use_cases_v_rels" USING btree ("topics_id");
  CREATE INDEX "_use_cases_v_rels_rai_dimensions_id_idx" ON "_use_cases_v_rels" USING btree ("rai_dimensions_id");
  CREATE INDEX "_use_cases_v_rels_enablers_id_idx" ON "_use_cases_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_use_cases_v_rels_tags_id_idx" ON "_use_cases_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "publications_slug_idx" ON "publications" USING btree ("slug");
  CREATE INDEX "publications_type_idx" ON "publications" USING btree ("type");
  CREATE INDEX "publications_file_idx" ON "publications" USING btree ("file_id");
  CREATE INDEX "publications_cover_idx" ON "publications" USING btree ("cover_id");
  CREATE INDEX "publications_seo_seo_image_idx" ON "publications" USING btree ("seo_image_id");
  CREATE INDEX "publications_updated_at_idx" ON "publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "publications" USING btree ("created_at");
  CREATE INDEX "publications_deleted_at_idx" ON "publications" USING btree ("deleted_at");
  CREATE INDEX "publications__status_idx" ON "publications" USING btree ("_status");
  CREATE INDEX "publications_rels_order_idx" ON "publications_rels" USING btree ("order");
  CREATE INDEX "publications_rels_parent_idx" ON "publications_rels" USING btree ("parent_id");
  CREATE INDEX "publications_rels_path_idx" ON "publications_rels" USING btree ("path");
  CREATE INDEX "publications_rels_people_id_idx" ON "publications_rels" USING btree ("people_id");
  CREATE INDEX "publications_rels_organisations_id_idx" ON "publications_rels" USING btree ("organisations_id");
  CREATE INDEX "publications_rels_use_cases_id_idx" ON "publications_rels" USING btree ("use_cases_id");
  CREATE INDEX "publications_rels_publications_id_idx" ON "publications_rels" USING btree ("publications_id");
  CREATE INDEX "publications_rels_datasets_id_idx" ON "publications_rels" USING btree ("datasets_id");
  CREATE INDEX "publications_rels_events_id_idx" ON "publications_rels" USING btree ("events_id");
  CREATE INDEX "publications_rels_learning_resources_id_idx" ON "publications_rels" USING btree ("learning_resources_id");
  CREATE INDEX "publications_rels_countries_id_idx" ON "publications_rels" USING btree ("countries_id");
  CREATE INDEX "publications_rels_topics_id_idx" ON "publications_rels" USING btree ("topics_id");
  CREATE INDEX "publications_rels_enablers_id_idx" ON "publications_rels" USING btree ("enablers_id");
  CREATE INDEX "publications_rels_rai_dimensions_id_idx" ON "publications_rels" USING btree ("rai_dimensions_id");
  CREATE INDEX "publications_rels_tags_id_idx" ON "publications_rels" USING btree ("tags_id");
  CREATE INDEX "_publications_v_parent_idx" ON "_publications_v" USING btree ("parent_id");
  CREATE INDEX "_publications_v_version_version_slug_idx" ON "_publications_v" USING btree ("version_slug");
  CREATE INDEX "_publications_v_version_version_type_idx" ON "_publications_v" USING btree ("version_type");
  CREATE INDEX "_publications_v_version_version_file_idx" ON "_publications_v" USING btree ("version_file_id");
  CREATE INDEX "_publications_v_version_version_cover_idx" ON "_publications_v" USING btree ("version_cover_id");
  CREATE INDEX "_publications_v_version_seo_version_seo_image_idx" ON "_publications_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_publications_v_version_version_updated_at_idx" ON "_publications_v" USING btree ("version_updated_at");
  CREATE INDEX "_publications_v_version_version_created_at_idx" ON "_publications_v" USING btree ("version_created_at");
  CREATE INDEX "_publications_v_version_version_deleted_at_idx" ON "_publications_v" USING btree ("version_deleted_at");
  CREATE INDEX "_publications_v_version_version__status_idx" ON "_publications_v" USING btree ("version__status");
  CREATE INDEX "_publications_v_created_at_idx" ON "_publications_v" USING btree ("created_at");
  CREATE INDEX "_publications_v_updated_at_idx" ON "_publications_v" USING btree ("updated_at");
  CREATE INDEX "_publications_v_snapshot_idx" ON "_publications_v" USING btree ("snapshot");
  CREATE INDEX "_publications_v_published_locale_idx" ON "_publications_v" USING btree ("published_locale");
  CREATE INDEX "_publications_v_latest_idx" ON "_publications_v" USING btree ("latest");
  CREATE INDEX "_publications_v_autosave_idx" ON "_publications_v" USING btree ("autosave");
  CREATE INDEX "_publications_v_rels_order_idx" ON "_publications_v_rels" USING btree ("order");
  CREATE INDEX "_publications_v_rels_parent_idx" ON "_publications_v_rels" USING btree ("parent_id");
  CREATE INDEX "_publications_v_rels_path_idx" ON "_publications_v_rels" USING btree ("path");
  CREATE INDEX "_publications_v_rels_people_id_idx" ON "_publications_v_rels" USING btree ("people_id");
  CREATE INDEX "_publications_v_rels_organisations_id_idx" ON "_publications_v_rels" USING btree ("organisations_id");
  CREATE INDEX "_publications_v_rels_use_cases_id_idx" ON "_publications_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_publications_v_rels_publications_id_idx" ON "_publications_v_rels" USING btree ("publications_id");
  CREATE INDEX "_publications_v_rels_datasets_id_idx" ON "_publications_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_publications_v_rels_events_id_idx" ON "_publications_v_rels" USING btree ("events_id");
  CREATE INDEX "_publications_v_rels_learning_resources_id_idx" ON "_publications_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_publications_v_rels_countries_id_idx" ON "_publications_v_rels" USING btree ("countries_id");
  CREATE INDEX "_publications_v_rels_topics_id_idx" ON "_publications_v_rels" USING btree ("topics_id");
  CREATE INDEX "_publications_v_rels_enablers_id_idx" ON "_publications_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_publications_v_rels_rai_dimensions_id_idx" ON "_publications_v_rels" USING btree ("rai_dimensions_id");
  CREATE INDEX "_publications_v_rels_tags_id_idx" ON "_publications_v_rels" USING btree ("tags_id");
  CREATE INDEX "datasets_files_order_idx" ON "datasets_files" USING btree ("_order");
  CREATE INDEX "datasets_files_parent_id_idx" ON "datasets_files" USING btree ("_parent_id");
  CREATE INDEX "datasets_files_file_idx" ON "datasets_files" USING btree ("file_id");
  CREATE INDEX "datasets_access_links_order_idx" ON "datasets_access_links" USING btree ("_order");
  CREATE INDEX "datasets_access_links_parent_id_idx" ON "datasets_access_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "datasets_slug_idx" ON "datasets" USING btree ("slug");
  CREATE INDEX "datasets_seo_seo_image_idx" ON "datasets" USING btree ("seo_image_id");
  CREATE INDEX "datasets_updated_at_idx" ON "datasets" USING btree ("updated_at");
  CREATE INDEX "datasets_created_at_idx" ON "datasets" USING btree ("created_at");
  CREATE INDEX "datasets_deleted_at_idx" ON "datasets" USING btree ("deleted_at");
  CREATE INDEX "datasets__status_idx" ON "datasets" USING btree ("_status");
  CREATE INDEX "datasets_rels_order_idx" ON "datasets_rels" USING btree ("order");
  CREATE INDEX "datasets_rels_parent_idx" ON "datasets_rels" USING btree ("parent_id");
  CREATE INDEX "datasets_rels_path_idx" ON "datasets_rels" USING btree ("path");
  CREATE INDEX "datasets_rels_indicators_id_idx" ON "datasets_rels" USING btree ("indicators_id");
  CREATE INDEX "datasets_rels_use_cases_id_idx" ON "datasets_rels" USING btree ("use_cases_id");
  CREATE INDEX "datasets_rels_publications_id_idx" ON "datasets_rels" USING btree ("publications_id");
  CREATE INDEX "datasets_rels_datasets_id_idx" ON "datasets_rels" USING btree ("datasets_id");
  CREATE INDEX "datasets_rels_events_id_idx" ON "datasets_rels" USING btree ("events_id");
  CREATE INDEX "datasets_rels_learning_resources_id_idx" ON "datasets_rels" USING btree ("learning_resources_id");
  CREATE INDEX "datasets_rels_countries_id_idx" ON "datasets_rels" USING btree ("countries_id");
  CREATE INDEX "datasets_rels_topics_id_idx" ON "datasets_rels" USING btree ("topics_id");
  CREATE INDEX "datasets_rels_enablers_id_idx" ON "datasets_rels" USING btree ("enablers_id");
  CREATE INDEX "datasets_rels_tags_id_idx" ON "datasets_rels" USING btree ("tags_id");
  CREATE INDEX "_datasets_v_version_files_order_idx" ON "_datasets_v_version_files" USING btree ("_order");
  CREATE INDEX "_datasets_v_version_files_parent_id_idx" ON "_datasets_v_version_files" USING btree ("_parent_id");
  CREATE INDEX "_datasets_v_version_files_file_idx" ON "_datasets_v_version_files" USING btree ("file_id");
  CREATE INDEX "_datasets_v_version_access_links_order_idx" ON "_datasets_v_version_access_links" USING btree ("_order");
  CREATE INDEX "_datasets_v_version_access_links_parent_id_idx" ON "_datasets_v_version_access_links" USING btree ("_parent_id");
  CREATE INDEX "_datasets_v_parent_idx" ON "_datasets_v" USING btree ("parent_id");
  CREATE INDEX "_datasets_v_version_version_slug_idx" ON "_datasets_v" USING btree ("version_slug");
  CREATE INDEX "_datasets_v_version_seo_version_seo_image_idx" ON "_datasets_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_datasets_v_version_version_updated_at_idx" ON "_datasets_v" USING btree ("version_updated_at");
  CREATE INDEX "_datasets_v_version_version_created_at_idx" ON "_datasets_v" USING btree ("version_created_at");
  CREATE INDEX "_datasets_v_version_version_deleted_at_idx" ON "_datasets_v" USING btree ("version_deleted_at");
  CREATE INDEX "_datasets_v_version_version__status_idx" ON "_datasets_v" USING btree ("version__status");
  CREATE INDEX "_datasets_v_created_at_idx" ON "_datasets_v" USING btree ("created_at");
  CREATE INDEX "_datasets_v_updated_at_idx" ON "_datasets_v" USING btree ("updated_at");
  CREATE INDEX "_datasets_v_snapshot_idx" ON "_datasets_v" USING btree ("snapshot");
  CREATE INDEX "_datasets_v_published_locale_idx" ON "_datasets_v" USING btree ("published_locale");
  CREATE INDEX "_datasets_v_latest_idx" ON "_datasets_v" USING btree ("latest");
  CREATE INDEX "_datasets_v_autosave_idx" ON "_datasets_v" USING btree ("autosave");
  CREATE INDEX "_datasets_v_rels_order_idx" ON "_datasets_v_rels" USING btree ("order");
  CREATE INDEX "_datasets_v_rels_parent_idx" ON "_datasets_v_rels" USING btree ("parent_id");
  CREATE INDEX "_datasets_v_rels_path_idx" ON "_datasets_v_rels" USING btree ("path");
  CREATE INDEX "_datasets_v_rels_indicators_id_idx" ON "_datasets_v_rels" USING btree ("indicators_id");
  CREATE INDEX "_datasets_v_rels_use_cases_id_idx" ON "_datasets_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_datasets_v_rels_publications_id_idx" ON "_datasets_v_rels" USING btree ("publications_id");
  CREATE INDEX "_datasets_v_rels_datasets_id_idx" ON "_datasets_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_datasets_v_rels_events_id_idx" ON "_datasets_v_rels" USING btree ("events_id");
  CREATE INDEX "_datasets_v_rels_learning_resources_id_idx" ON "_datasets_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_datasets_v_rels_countries_id_idx" ON "_datasets_v_rels" USING btree ("countries_id");
  CREATE INDEX "_datasets_v_rels_topics_id_idx" ON "_datasets_v_rels" USING btree ("topics_id");
  CREATE INDEX "_datasets_v_rels_enablers_id_idx" ON "_datasets_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_datasets_v_rels_tags_id_idx" ON "_datasets_v_rels" USING btree ("tags_id");
  CREATE INDEX "indicators_status_labels_order_idx" ON "indicators_status_labels" USING btree ("_order");
  CREATE INDEX "indicators_status_labels_parent_id_idx" ON "indicators_status_labels" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "indicators_slug_idx" ON "indicators" USING btree ("slug");
  CREATE INDEX "indicators_enabler_idx" ON "indicators" USING btree ("enabler_id");
  CREATE INDEX "indicators_dataset_idx" ON "indicators" USING btree ("dataset_id");
  CREATE INDEX "indicators_updated_at_idx" ON "indicators" USING btree ("updated_at");
  CREATE INDEX "indicators_created_at_idx" ON "indicators" USING btree ("created_at");
  CREATE INDEX "indicators_rels_order_idx" ON "indicators_rels" USING btree ("order");
  CREATE INDEX "indicators_rels_parent_idx" ON "indicators_rels" USING btree ("parent_id");
  CREATE INDEX "indicators_rels_path_idx" ON "indicators_rels" USING btree ("path");
  CREATE INDEX "indicators_rels_topics_id_idx" ON "indicators_rels" USING btree ("topics_id");
  CREATE INDEX "indicator_values_indicator_idx" ON "indicator_values" USING btree ("indicator_id");
  CREATE INDEX "indicator_values_country_idx" ON "indicator_values" USING btree ("country_id");
  CREATE INDEX "indicator_values_year_idx" ON "indicator_values" USING btree ("year");
  CREATE INDEX "indicator_values_updated_at_idx" ON "indicator_values" USING btree ("updated_at");
  CREATE INDEX "indicator_values_created_at_idx" ON "indicator_values" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_image_idx" ON "posts" USING btree ("image_id");
  CREATE INDEX "posts_seo_seo_image_idx" ON "posts" USING btree ("seo_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts_deleted_at_idx" ON "posts" USING btree ("deleted_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_people_id_idx" ON "posts_rels" USING btree ("people_id");
  CREATE INDEX "posts_rels_use_cases_id_idx" ON "posts_rels" USING btree ("use_cases_id");
  CREATE INDEX "posts_rels_publications_id_idx" ON "posts_rels" USING btree ("publications_id");
  CREATE INDEX "posts_rels_datasets_id_idx" ON "posts_rels" USING btree ("datasets_id");
  CREATE INDEX "posts_rels_events_id_idx" ON "posts_rels" USING btree ("events_id");
  CREATE INDEX "posts_rels_learning_resources_id_idx" ON "posts_rels" USING btree ("learning_resources_id");
  CREATE INDEX "posts_rels_countries_id_idx" ON "posts_rels" USING btree ("countries_id");
  CREATE INDEX "posts_rels_topics_id_idx" ON "posts_rels" USING btree ("topics_id");
  CREATE INDEX "posts_rels_enablers_id_idx" ON "posts_rels" USING btree ("enablers_id");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_image_idx" ON "_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_image_idx" ON "_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version_deleted_at_idx" ON "_posts_v" USING btree ("version_deleted_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_people_id_idx" ON "_posts_v_rels" USING btree ("people_id");
  CREATE INDEX "_posts_v_rels_use_cases_id_idx" ON "_posts_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_posts_v_rels_publications_id_idx" ON "_posts_v_rels" USING btree ("publications_id");
  CREATE INDEX "_posts_v_rels_datasets_id_idx" ON "_posts_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_posts_v_rels_events_id_idx" ON "_posts_v_rels" USING btree ("events_id");
  CREATE INDEX "_posts_v_rels_learning_resources_id_idx" ON "_posts_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_posts_v_rels_countries_id_idx" ON "_posts_v_rels" USING btree ("countries_id");
  CREATE INDEX "_posts_v_rels_topics_id_idx" ON "_posts_v_rels" USING btree ("topics_id");
  CREATE INDEX "_posts_v_rels_enablers_id_idx" ON "_posts_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "op_eds_slug_idx" ON "op_eds" USING btree ("slug");
  CREATE INDEX "op_eds_image_idx" ON "op_eds" USING btree ("image_id");
  CREATE INDEX "op_eds_seo_seo_image_idx" ON "op_eds" USING btree ("seo_image_id");
  CREATE INDEX "op_eds_updated_at_idx" ON "op_eds" USING btree ("updated_at");
  CREATE INDEX "op_eds_created_at_idx" ON "op_eds" USING btree ("created_at");
  CREATE INDEX "op_eds_deleted_at_idx" ON "op_eds" USING btree ("deleted_at");
  CREATE INDEX "op_eds__status_idx" ON "op_eds" USING btree ("_status");
  CREATE INDEX "op_eds_rels_order_idx" ON "op_eds_rels" USING btree ("order");
  CREATE INDEX "op_eds_rels_parent_idx" ON "op_eds_rels" USING btree ("parent_id");
  CREATE INDEX "op_eds_rels_path_idx" ON "op_eds_rels" USING btree ("path");
  CREATE INDEX "op_eds_rels_people_id_idx" ON "op_eds_rels" USING btree ("people_id");
  CREATE INDEX "op_eds_rels_use_cases_id_idx" ON "op_eds_rels" USING btree ("use_cases_id");
  CREATE INDEX "op_eds_rels_publications_id_idx" ON "op_eds_rels" USING btree ("publications_id");
  CREATE INDEX "op_eds_rels_datasets_id_idx" ON "op_eds_rels" USING btree ("datasets_id");
  CREATE INDEX "op_eds_rels_events_id_idx" ON "op_eds_rels" USING btree ("events_id");
  CREATE INDEX "op_eds_rels_learning_resources_id_idx" ON "op_eds_rels" USING btree ("learning_resources_id");
  CREATE INDEX "op_eds_rels_countries_id_idx" ON "op_eds_rels" USING btree ("countries_id");
  CREATE INDEX "op_eds_rels_topics_id_idx" ON "op_eds_rels" USING btree ("topics_id");
  CREATE INDEX "op_eds_rels_enablers_id_idx" ON "op_eds_rels" USING btree ("enablers_id");
  CREATE INDEX "op_eds_rels_tags_id_idx" ON "op_eds_rels" USING btree ("tags_id");
  CREATE INDEX "_op_eds_v_parent_idx" ON "_op_eds_v" USING btree ("parent_id");
  CREATE INDEX "_op_eds_v_version_version_slug_idx" ON "_op_eds_v" USING btree ("version_slug");
  CREATE INDEX "_op_eds_v_version_version_image_idx" ON "_op_eds_v" USING btree ("version_image_id");
  CREATE INDEX "_op_eds_v_version_seo_version_seo_image_idx" ON "_op_eds_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_op_eds_v_version_version_updated_at_idx" ON "_op_eds_v" USING btree ("version_updated_at");
  CREATE INDEX "_op_eds_v_version_version_created_at_idx" ON "_op_eds_v" USING btree ("version_created_at");
  CREATE INDEX "_op_eds_v_version_version_deleted_at_idx" ON "_op_eds_v" USING btree ("version_deleted_at");
  CREATE INDEX "_op_eds_v_version_version__status_idx" ON "_op_eds_v" USING btree ("version__status");
  CREATE INDEX "_op_eds_v_created_at_idx" ON "_op_eds_v" USING btree ("created_at");
  CREATE INDEX "_op_eds_v_updated_at_idx" ON "_op_eds_v" USING btree ("updated_at");
  CREATE INDEX "_op_eds_v_snapshot_idx" ON "_op_eds_v" USING btree ("snapshot");
  CREATE INDEX "_op_eds_v_published_locale_idx" ON "_op_eds_v" USING btree ("published_locale");
  CREATE INDEX "_op_eds_v_latest_idx" ON "_op_eds_v" USING btree ("latest");
  CREATE INDEX "_op_eds_v_autosave_idx" ON "_op_eds_v" USING btree ("autosave");
  CREATE INDEX "_op_eds_v_rels_order_idx" ON "_op_eds_v_rels" USING btree ("order");
  CREATE INDEX "_op_eds_v_rels_parent_idx" ON "_op_eds_v_rels" USING btree ("parent_id");
  CREATE INDEX "_op_eds_v_rels_path_idx" ON "_op_eds_v_rels" USING btree ("path");
  CREATE INDEX "_op_eds_v_rels_people_id_idx" ON "_op_eds_v_rels" USING btree ("people_id");
  CREATE INDEX "_op_eds_v_rels_use_cases_id_idx" ON "_op_eds_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_op_eds_v_rels_publications_id_idx" ON "_op_eds_v_rels" USING btree ("publications_id");
  CREATE INDEX "_op_eds_v_rels_datasets_id_idx" ON "_op_eds_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_op_eds_v_rels_events_id_idx" ON "_op_eds_v_rels" USING btree ("events_id");
  CREATE INDEX "_op_eds_v_rels_learning_resources_id_idx" ON "_op_eds_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_op_eds_v_rels_countries_id_idx" ON "_op_eds_v_rels" USING btree ("countries_id");
  CREATE INDEX "_op_eds_v_rels_topics_id_idx" ON "_op_eds_v_rels" USING btree ("topics_id");
  CREATE INDEX "_op_eds_v_rels_enablers_id_idx" ON "_op_eds_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_op_eds_v_rels_tags_id_idx" ON "_op_eds_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_seo_seo_image_idx" ON "news" USING btree ("seo_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news_deleted_at_idx" ON "news" USING btree ("deleted_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_people_id_idx" ON "news_rels" USING btree ("people_id");
  CREATE INDEX "news_rels_use_cases_id_idx" ON "news_rels" USING btree ("use_cases_id");
  CREATE INDEX "news_rels_publications_id_idx" ON "news_rels" USING btree ("publications_id");
  CREATE INDEX "news_rels_datasets_id_idx" ON "news_rels" USING btree ("datasets_id");
  CREATE INDEX "news_rels_events_id_idx" ON "news_rels" USING btree ("events_id");
  CREATE INDEX "news_rels_learning_resources_id_idx" ON "news_rels" USING btree ("learning_resources_id");
  CREATE INDEX "news_rels_countries_id_idx" ON "news_rels" USING btree ("countries_id");
  CREATE INDEX "news_rels_topics_id_idx" ON "news_rels" USING btree ("topics_id");
  CREATE INDEX "news_rels_enablers_id_idx" ON "news_rels" USING btree ("enablers_id");
  CREATE INDEX "news_rels_tags_id_idx" ON "news_rels" USING btree ("tags_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_seo_version_seo_image_idx" ON "_news_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version_deleted_at_idx" ON "_news_v" USING btree ("version_deleted_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_people_id_idx" ON "_news_v_rels" USING btree ("people_id");
  CREATE INDEX "_news_v_rels_use_cases_id_idx" ON "_news_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_news_v_rels_publications_id_idx" ON "_news_v_rels" USING btree ("publications_id");
  CREATE INDEX "_news_v_rels_datasets_id_idx" ON "_news_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_news_v_rels_events_id_idx" ON "_news_v_rels" USING btree ("events_id");
  CREATE INDEX "_news_v_rels_learning_resources_id_idx" ON "_news_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_news_v_rels_countries_id_idx" ON "_news_v_rels" USING btree ("countries_id");
  CREATE INDEX "_news_v_rels_topics_id_idx" ON "_news_v_rels" USING btree ("topics_id");
  CREATE INDEX "_news_v_rels_enablers_id_idx" ON "_news_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_news_v_rels_tags_id_idx" ON "_news_v_rels" USING btree ("tags_id");
  CREATE INDEX "people_links_order_idx" ON "people_links" USING btree ("_order");
  CREATE INDEX "people_links_parent_id_idx" ON "people_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "people_slug_idx" ON "people" USING btree ("slug");
  CREATE INDEX "people_organisation_idx" ON "people" USING btree ("organisation_id");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_seo_seo_image_idx" ON "people" USING btree ("seo_image_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people_deleted_at_idx" ON "people" USING btree ("deleted_at");
  CREATE INDEX "people__status_idx" ON "people" USING btree ("_status");
  CREATE INDEX "people_rels_order_idx" ON "people_rels" USING btree ("order");
  CREATE INDEX "people_rels_parent_idx" ON "people_rels" USING btree ("parent_id");
  CREATE INDEX "people_rels_path_idx" ON "people_rels" USING btree ("path");
  CREATE INDEX "people_rels_topics_id_idx" ON "people_rels" USING btree ("topics_id");
  CREATE INDEX "people_rels_countries_id_idx" ON "people_rels" USING btree ("countries_id");
  CREATE INDEX "people_rels_enablers_id_idx" ON "people_rels" USING btree ("enablers_id");
  CREATE INDEX "people_rels_tags_id_idx" ON "people_rels" USING btree ("tags_id");
  CREATE INDEX "_people_v_version_links_order_idx" ON "_people_v_version_links" USING btree ("_order");
  CREATE INDEX "_people_v_version_links_parent_id_idx" ON "_people_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_people_v_parent_idx" ON "_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_slug_idx" ON "_people_v" USING btree ("version_slug");
  CREATE INDEX "_people_v_version_version_organisation_idx" ON "_people_v" USING btree ("version_organisation_id");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_seo_version_seo_image_idx" ON "_people_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_version_version_deleted_at_idx" ON "_people_v" USING btree ("version_deleted_at");
  CREATE INDEX "_people_v_version_version__status_idx" ON "_people_v" USING btree ("version__status");
  CREATE INDEX "_people_v_created_at_idx" ON "_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "_people_v" USING btree ("updated_at");
  CREATE INDEX "_people_v_snapshot_idx" ON "_people_v" USING btree ("snapshot");
  CREATE INDEX "_people_v_published_locale_idx" ON "_people_v" USING btree ("published_locale");
  CREATE INDEX "_people_v_latest_idx" ON "_people_v" USING btree ("latest");
  CREATE INDEX "_people_v_autosave_idx" ON "_people_v" USING btree ("autosave");
  CREATE INDEX "_people_v_rels_order_idx" ON "_people_v_rels" USING btree ("order");
  CREATE INDEX "_people_v_rels_parent_idx" ON "_people_v_rels" USING btree ("parent_id");
  CREATE INDEX "_people_v_rels_path_idx" ON "_people_v_rels" USING btree ("path");
  CREATE INDEX "_people_v_rels_topics_id_idx" ON "_people_v_rels" USING btree ("topics_id");
  CREATE INDEX "_people_v_rels_countries_id_idx" ON "_people_v_rels" USING btree ("countries_id");
  CREATE INDEX "_people_v_rels_enablers_id_idx" ON "_people_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_people_v_rels_tags_id_idx" ON "_people_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "organisations_slug_idx" ON "organisations" USING btree ("slug");
  CREATE INDEX "organisations_stakeholder_type_idx" ON "organisations" USING btree ("stakeholder_type_id");
  CREATE INDEX "organisations_logo_idx" ON "organisations" USING btree ("logo_id");
  CREATE INDEX "organisations_seo_seo_image_idx" ON "organisations" USING btree ("seo_image_id");
  CREATE INDEX "organisations_updated_at_idx" ON "organisations" USING btree ("updated_at");
  CREATE INDEX "organisations_created_at_idx" ON "organisations" USING btree ("created_at");
  CREATE INDEX "organisations_deleted_at_idx" ON "organisations" USING btree ("deleted_at");
  CREATE INDEX "organisations__status_idx" ON "organisations" USING btree ("_status");
  CREATE INDEX "organisations_rels_order_idx" ON "organisations_rels" USING btree ("order");
  CREATE INDEX "organisations_rels_parent_idx" ON "organisations_rels" USING btree ("parent_id");
  CREATE INDEX "organisations_rels_path_idx" ON "organisations_rels" USING btree ("path");
  CREATE INDEX "organisations_rels_countries_id_idx" ON "organisations_rels" USING btree ("countries_id");
  CREATE INDEX "organisations_rels_topics_id_idx" ON "organisations_rels" USING btree ("topics_id");
  CREATE INDEX "organisations_rels_enablers_id_idx" ON "organisations_rels" USING btree ("enablers_id");
  CREATE INDEX "organisations_rels_tags_id_idx" ON "organisations_rels" USING btree ("tags_id");
  CREATE INDEX "_organisations_v_parent_idx" ON "_organisations_v" USING btree ("parent_id");
  CREATE INDEX "_organisations_v_version_version_slug_idx" ON "_organisations_v" USING btree ("version_slug");
  CREATE INDEX "_organisations_v_version_version_stakeholder_type_idx" ON "_organisations_v" USING btree ("version_stakeholder_type_id");
  CREATE INDEX "_organisations_v_version_version_logo_idx" ON "_organisations_v" USING btree ("version_logo_id");
  CREATE INDEX "_organisations_v_version_seo_version_seo_image_idx" ON "_organisations_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_organisations_v_version_version_updated_at_idx" ON "_organisations_v" USING btree ("version_updated_at");
  CREATE INDEX "_organisations_v_version_version_created_at_idx" ON "_organisations_v" USING btree ("version_created_at");
  CREATE INDEX "_organisations_v_version_version_deleted_at_idx" ON "_organisations_v" USING btree ("version_deleted_at");
  CREATE INDEX "_organisations_v_version_version__status_idx" ON "_organisations_v" USING btree ("version__status");
  CREATE INDEX "_organisations_v_created_at_idx" ON "_organisations_v" USING btree ("created_at");
  CREATE INDEX "_organisations_v_updated_at_idx" ON "_organisations_v" USING btree ("updated_at");
  CREATE INDEX "_organisations_v_snapshot_idx" ON "_organisations_v" USING btree ("snapshot");
  CREATE INDEX "_organisations_v_published_locale_idx" ON "_organisations_v" USING btree ("published_locale");
  CREATE INDEX "_organisations_v_latest_idx" ON "_organisations_v" USING btree ("latest");
  CREATE INDEX "_organisations_v_autosave_idx" ON "_organisations_v" USING btree ("autosave");
  CREATE INDEX "_organisations_v_rels_order_idx" ON "_organisations_v_rels" USING btree ("order");
  CREATE INDEX "_organisations_v_rels_parent_idx" ON "_organisations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_organisations_v_rels_path_idx" ON "_organisations_v_rels" USING btree ("path");
  CREATE INDEX "_organisations_v_rels_countries_id_idx" ON "_organisations_v_rels" USING btree ("countries_id");
  CREATE INDEX "_organisations_v_rels_topics_id_idx" ON "_organisations_v_rels" USING btree ("topics_id");
  CREATE INDEX "_organisations_v_rels_enablers_id_idx" ON "_organisations_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_organisations_v_rels_tags_id_idx" ON "_organisations_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_seo_seo_image_idx" ON "events" USING btree ("seo_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events_deleted_at_idx" ON "events" USING btree ("deleted_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_organisations_id_idx" ON "events_rels" USING btree ("organisations_id");
  CREATE INDEX "events_rels_people_id_idx" ON "events_rels" USING btree ("people_id");
  CREATE INDEX "events_rels_use_cases_id_idx" ON "events_rels" USING btree ("use_cases_id");
  CREATE INDEX "events_rels_publications_id_idx" ON "events_rels" USING btree ("publications_id");
  CREATE INDEX "events_rels_datasets_id_idx" ON "events_rels" USING btree ("datasets_id");
  CREATE INDEX "events_rels_events_id_idx" ON "events_rels" USING btree ("events_id");
  CREATE INDEX "events_rels_learning_resources_id_idx" ON "events_rels" USING btree ("learning_resources_id");
  CREATE INDEX "events_rels_countries_id_idx" ON "events_rels" USING btree ("countries_id");
  CREATE INDEX "events_rels_topics_id_idx" ON "events_rels" USING btree ("topics_id");
  CREATE INDEX "events_rels_enablers_id_idx" ON "events_rels" USING btree ("enablers_id");
  CREATE INDEX "events_rels_tags_id_idx" ON "events_rels" USING btree ("tags_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_start_date_idx" ON "_events_v" USING btree ("version_start_date");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_seo_version_seo_image_idx" ON "_events_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version_deleted_at_idx" ON "_events_v" USING btree ("version_deleted_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_organisations_id_idx" ON "_events_v_rels" USING btree ("organisations_id");
  CREATE INDEX "_events_v_rels_people_id_idx" ON "_events_v_rels" USING btree ("people_id");
  CREATE INDEX "_events_v_rels_use_cases_id_idx" ON "_events_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_events_v_rels_publications_id_idx" ON "_events_v_rels" USING btree ("publications_id");
  CREATE INDEX "_events_v_rels_datasets_id_idx" ON "_events_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_events_v_rels_events_id_idx" ON "_events_v_rels" USING btree ("events_id");
  CREATE INDEX "_events_v_rels_learning_resources_id_idx" ON "_events_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_events_v_rels_countries_id_idx" ON "_events_v_rels" USING btree ("countries_id");
  CREATE INDEX "_events_v_rels_topics_id_idx" ON "_events_v_rels" USING btree ("topics_id");
  CREATE INDEX "_events_v_rels_enablers_id_idx" ON "_events_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_events_v_rels_tags_id_idx" ON "_events_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "learning_resources_slug_idx" ON "learning_resources" USING btree ("slug");
  CREATE INDEX "learning_resources_resource_type_idx" ON "learning_resources" USING btree ("resource_type");
  CREATE INDEX "learning_resources_provider_organisation_idx" ON "learning_resources" USING btree ("provider_organisation_id");
  CREATE INDEX "learning_resources_file_idx" ON "learning_resources" USING btree ("file_id");
  CREATE INDEX "learning_resources_seo_seo_image_idx" ON "learning_resources" USING btree ("seo_image_id");
  CREATE INDEX "learning_resources_updated_at_idx" ON "learning_resources" USING btree ("updated_at");
  CREATE INDEX "learning_resources_created_at_idx" ON "learning_resources" USING btree ("created_at");
  CREATE INDEX "learning_resources_deleted_at_idx" ON "learning_resources" USING btree ("deleted_at");
  CREATE INDEX "learning_resources__status_idx" ON "learning_resources" USING btree ("_status");
  CREATE INDEX "learning_resources_rels_order_idx" ON "learning_resources_rels" USING btree ("order");
  CREATE INDEX "learning_resources_rels_parent_idx" ON "learning_resources_rels" USING btree ("parent_id");
  CREATE INDEX "learning_resources_rels_path_idx" ON "learning_resources_rels" USING btree ("path");
  CREATE INDEX "learning_resources_rels_use_cases_id_idx" ON "learning_resources_rels" USING btree ("use_cases_id");
  CREATE INDEX "learning_resources_rels_publications_id_idx" ON "learning_resources_rels" USING btree ("publications_id");
  CREATE INDEX "learning_resources_rels_datasets_id_idx" ON "learning_resources_rels" USING btree ("datasets_id");
  CREATE INDEX "learning_resources_rels_events_id_idx" ON "learning_resources_rels" USING btree ("events_id");
  CREATE INDEX "learning_resources_rels_learning_resources_id_idx" ON "learning_resources_rels" USING btree ("learning_resources_id");
  CREATE INDEX "learning_resources_rels_countries_id_idx" ON "learning_resources_rels" USING btree ("countries_id");
  CREATE INDEX "learning_resources_rels_topics_id_idx" ON "learning_resources_rels" USING btree ("topics_id");
  CREATE INDEX "learning_resources_rels_enablers_id_idx" ON "learning_resources_rels" USING btree ("enablers_id");
  CREATE INDEX "learning_resources_rels_rai_dimensions_id_idx" ON "learning_resources_rels" USING btree ("rai_dimensions_id");
  CREATE INDEX "learning_resources_rels_tags_id_idx" ON "learning_resources_rels" USING btree ("tags_id");
  CREATE INDEX "_learning_resources_v_parent_idx" ON "_learning_resources_v" USING btree ("parent_id");
  CREATE INDEX "_learning_resources_v_version_version_slug_idx" ON "_learning_resources_v" USING btree ("version_slug");
  CREATE INDEX "_learning_resources_v_version_version_resource_type_idx" ON "_learning_resources_v" USING btree ("version_resource_type");
  CREATE INDEX "_learning_resources_v_version_version_provider_organisat_idx" ON "_learning_resources_v" USING btree ("version_provider_organisation_id");
  CREATE INDEX "_learning_resources_v_version_version_file_idx" ON "_learning_resources_v" USING btree ("version_file_id");
  CREATE INDEX "_learning_resources_v_version_seo_version_seo_image_idx" ON "_learning_resources_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_learning_resources_v_version_version_updated_at_idx" ON "_learning_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_learning_resources_v_version_version_created_at_idx" ON "_learning_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_learning_resources_v_version_version_deleted_at_idx" ON "_learning_resources_v" USING btree ("version_deleted_at");
  CREATE INDEX "_learning_resources_v_version_version__status_idx" ON "_learning_resources_v" USING btree ("version__status");
  CREATE INDEX "_learning_resources_v_created_at_idx" ON "_learning_resources_v" USING btree ("created_at");
  CREATE INDEX "_learning_resources_v_updated_at_idx" ON "_learning_resources_v" USING btree ("updated_at");
  CREATE INDEX "_learning_resources_v_snapshot_idx" ON "_learning_resources_v" USING btree ("snapshot");
  CREATE INDEX "_learning_resources_v_published_locale_idx" ON "_learning_resources_v" USING btree ("published_locale");
  CREATE INDEX "_learning_resources_v_latest_idx" ON "_learning_resources_v" USING btree ("latest");
  CREATE INDEX "_learning_resources_v_autosave_idx" ON "_learning_resources_v" USING btree ("autosave");
  CREATE INDEX "_learning_resources_v_rels_order_idx" ON "_learning_resources_v_rels" USING btree ("order");
  CREATE INDEX "_learning_resources_v_rels_parent_idx" ON "_learning_resources_v_rels" USING btree ("parent_id");
  CREATE INDEX "_learning_resources_v_rels_path_idx" ON "_learning_resources_v_rels" USING btree ("path");
  CREATE INDEX "_learning_resources_v_rels_use_cases_id_idx" ON "_learning_resources_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_learning_resources_v_rels_publications_id_idx" ON "_learning_resources_v_rels" USING btree ("publications_id");
  CREATE INDEX "_learning_resources_v_rels_datasets_id_idx" ON "_learning_resources_v_rels" USING btree ("datasets_id");
  CREATE INDEX "_learning_resources_v_rels_events_id_idx" ON "_learning_resources_v_rels" USING btree ("events_id");
  CREATE INDEX "_learning_resources_v_rels_learning_resources_id_idx" ON "_learning_resources_v_rels" USING btree ("learning_resources_id");
  CREATE INDEX "_learning_resources_v_rels_countries_id_idx" ON "_learning_resources_v_rels" USING btree ("countries_id");
  CREATE INDEX "_learning_resources_v_rels_topics_id_idx" ON "_learning_resources_v_rels" USING btree ("topics_id");
  CREATE INDEX "_learning_resources_v_rels_enablers_id_idx" ON "_learning_resources_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_learning_resources_v_rels_rai_dimensions_id_idx" ON "_learning_resources_v_rels" USING btree ("rai_dimensions_id");
  CREATE INDEX "_learning_resources_v_rels_tags_id_idx" ON "_learning_resources_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "opportunities_slug_idx" ON "opportunities" USING btree ("slug");
  CREATE INDEX "opportunities_opportunity_type_idx" ON "opportunities" USING btree ("opportunity_type");
  CREATE INDEX "opportunities_deadline_idx" ON "opportunities" USING btree ("deadline");
  CREATE INDEX "opportunities_seo_seo_image_idx" ON "opportunities" USING btree ("seo_image_id");
  CREATE INDEX "opportunities_updated_at_idx" ON "opportunities" USING btree ("updated_at");
  CREATE INDEX "opportunities_created_at_idx" ON "opportunities" USING btree ("created_at");
  CREATE INDEX "opportunities_deleted_at_idx" ON "opportunities" USING btree ("deleted_at");
  CREATE INDEX "opportunities__status_idx" ON "opportunities" USING btree ("_status");
  CREATE INDEX "opportunities_rels_order_idx" ON "opportunities_rels" USING btree ("order");
  CREATE INDEX "opportunities_rels_parent_idx" ON "opportunities_rels" USING btree ("parent_id");
  CREATE INDEX "opportunities_rels_path_idx" ON "opportunities_rels" USING btree ("path");
  CREATE INDEX "opportunities_rels_countries_id_idx" ON "opportunities_rels" USING btree ("countries_id");
  CREATE INDEX "opportunities_rels_topics_id_idx" ON "opportunities_rels" USING btree ("topics_id");
  CREATE INDEX "opportunities_rels_enablers_id_idx" ON "opportunities_rels" USING btree ("enablers_id");
  CREATE INDEX "opportunities_rels_tags_id_idx" ON "opportunities_rels" USING btree ("tags_id");
  CREATE INDEX "_opportunities_v_parent_idx" ON "_opportunities_v" USING btree ("parent_id");
  CREATE INDEX "_opportunities_v_version_version_slug_idx" ON "_opportunities_v" USING btree ("version_slug");
  CREATE INDEX "_opportunities_v_version_version_opportunity_type_idx" ON "_opportunities_v" USING btree ("version_opportunity_type");
  CREATE INDEX "_opportunities_v_version_version_deadline_idx" ON "_opportunities_v" USING btree ("version_deadline");
  CREATE INDEX "_opportunities_v_version_seo_version_seo_image_idx" ON "_opportunities_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_opportunities_v_version_version_updated_at_idx" ON "_opportunities_v" USING btree ("version_updated_at");
  CREATE INDEX "_opportunities_v_version_version_created_at_idx" ON "_opportunities_v" USING btree ("version_created_at");
  CREATE INDEX "_opportunities_v_version_version_deleted_at_idx" ON "_opportunities_v" USING btree ("version_deleted_at");
  CREATE INDEX "_opportunities_v_version_version__status_idx" ON "_opportunities_v" USING btree ("version__status");
  CREATE INDEX "_opportunities_v_created_at_idx" ON "_opportunities_v" USING btree ("created_at");
  CREATE INDEX "_opportunities_v_updated_at_idx" ON "_opportunities_v" USING btree ("updated_at");
  CREATE INDEX "_opportunities_v_snapshot_idx" ON "_opportunities_v" USING btree ("snapshot");
  CREATE INDEX "_opportunities_v_published_locale_idx" ON "_opportunities_v" USING btree ("published_locale");
  CREATE INDEX "_opportunities_v_latest_idx" ON "_opportunities_v" USING btree ("latest");
  CREATE INDEX "_opportunities_v_autosave_idx" ON "_opportunities_v" USING btree ("autosave");
  CREATE INDEX "_opportunities_v_rels_order_idx" ON "_opportunities_v_rels" USING btree ("order");
  CREATE INDEX "_opportunities_v_rels_parent_idx" ON "_opportunities_v_rels" USING btree ("parent_id");
  CREATE INDEX "_opportunities_v_rels_path_idx" ON "_opportunities_v_rels" USING btree ("path");
  CREATE INDEX "_opportunities_v_rels_countries_id_idx" ON "_opportunities_v_rels" USING btree ("countries_id");
  CREATE INDEX "_opportunities_v_rels_topics_id_idx" ON "_opportunities_v_rels" USING btree ("topics_id");
  CREATE INDEX "_opportunities_v_rels_enablers_id_idx" ON "_opportunities_v_rels" USING btree ("enablers_id");
  CREATE INDEX "_opportunities_v_rels_tags_id_idx" ON "_opportunities_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "newsletters_slug_idx" ON "newsletters" USING btree ("slug");
  CREATE INDEX "newsletters_pdf_idx" ON "newsletters" USING btree ("pdf_id");
  CREATE INDEX "newsletters_seo_seo_image_idx" ON "newsletters" USING btree ("seo_image_id");
  CREATE INDEX "newsletters_updated_at_idx" ON "newsletters" USING btree ("updated_at");
  CREATE INDEX "newsletters_created_at_idx" ON "newsletters" USING btree ("created_at");
  CREATE INDEX "newsletters_deleted_at_idx" ON "newsletters" USING btree ("deleted_at");
  CREATE INDEX "newsletters__status_idx" ON "newsletters" USING btree ("_status");
  CREATE INDEX "newsletters_rels_order_idx" ON "newsletters_rels" USING btree ("order");
  CREATE INDEX "newsletters_rels_parent_idx" ON "newsletters_rels" USING btree ("parent_id");
  CREATE INDEX "newsletters_rels_path_idx" ON "newsletters_rels" USING btree ("path");
  CREATE INDEX "newsletters_rels_use_cases_id_idx" ON "newsletters_rels" USING btree ("use_cases_id");
  CREATE INDEX "newsletters_rels_publications_id_idx" ON "newsletters_rels" USING btree ("publications_id");
  CREATE INDEX "newsletters_rels_events_id_idx" ON "newsletters_rels" USING btree ("events_id");
  CREATE INDEX "newsletters_rels_posts_id_idx" ON "newsletters_rels" USING btree ("posts_id");
  CREATE INDEX "newsletters_rels_opportunities_id_idx" ON "newsletters_rels" USING btree ("opportunities_id");
  CREATE INDEX "_newsletters_v_parent_idx" ON "_newsletters_v" USING btree ("parent_id");
  CREATE INDEX "_newsletters_v_version_version_slug_idx" ON "_newsletters_v" USING btree ("version_slug");
  CREATE INDEX "_newsletters_v_version_version_pdf_idx" ON "_newsletters_v" USING btree ("version_pdf_id");
  CREATE INDEX "_newsletters_v_version_seo_version_seo_image_idx" ON "_newsletters_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_newsletters_v_version_version_updated_at_idx" ON "_newsletters_v" USING btree ("version_updated_at");
  CREATE INDEX "_newsletters_v_version_version_created_at_idx" ON "_newsletters_v" USING btree ("version_created_at");
  CREATE INDEX "_newsletters_v_version_version_deleted_at_idx" ON "_newsletters_v" USING btree ("version_deleted_at");
  CREATE INDEX "_newsletters_v_version_version__status_idx" ON "_newsletters_v" USING btree ("version__status");
  CREATE INDEX "_newsletters_v_created_at_idx" ON "_newsletters_v" USING btree ("created_at");
  CREATE INDEX "_newsletters_v_updated_at_idx" ON "_newsletters_v" USING btree ("updated_at");
  CREATE INDEX "_newsletters_v_snapshot_idx" ON "_newsletters_v" USING btree ("snapshot");
  CREATE INDEX "_newsletters_v_published_locale_idx" ON "_newsletters_v" USING btree ("published_locale");
  CREATE INDEX "_newsletters_v_latest_idx" ON "_newsletters_v" USING btree ("latest");
  CREATE INDEX "_newsletters_v_autosave_idx" ON "_newsletters_v" USING btree ("autosave");
  CREATE INDEX "_newsletters_v_rels_order_idx" ON "_newsletters_v_rels" USING btree ("order");
  CREATE INDEX "_newsletters_v_rels_parent_idx" ON "_newsletters_v_rels" USING btree ("parent_id");
  CREATE INDEX "_newsletters_v_rels_path_idx" ON "_newsletters_v_rels" USING btree ("path");
  CREATE INDEX "_newsletters_v_rels_use_cases_id_idx" ON "_newsletters_v_rels" USING btree ("use_cases_id");
  CREATE INDEX "_newsletters_v_rels_publications_id_idx" ON "_newsletters_v_rels" USING btree ("publications_id");
  CREATE INDEX "_newsletters_v_rels_events_id_idx" ON "_newsletters_v_rels" USING btree ("events_id");
  CREATE INDEX "_newsletters_v_rels_posts_id_idx" ON "_newsletters_v_rels" USING btree ("posts_id");
  CREATE INDEX "_newsletters_v_rels_opportunities_id_idx" ON "_newsletters_v_rels" USING btree ("opportunities_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "countries_name_idx" ON "countries" USING btree ("name");
  CREATE UNIQUE INDEX "countries_slug_idx" ON "countries" USING btree ("slug");
  CREATE UNIQUE INDEX "countries_iso3_idx" ON "countries" USING btree ("iso3");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE UNIQUE INDEX "topics_name_idx" ON "topics" USING btree ("name");
  CREATE UNIQUE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");
  CREATE INDEX "topics_updated_at_idx" ON "topics" USING btree ("updated_at");
  CREATE INDEX "topics_created_at_idx" ON "topics" USING btree ("created_at");
  CREATE UNIQUE INDEX "enablers_name_idx" ON "enablers" USING btree ("name");
  CREATE UNIQUE INDEX "enablers_slug_idx" ON "enablers" USING btree ("slug");
  CREATE INDEX "enablers_updated_at_idx" ON "enablers" USING btree ("updated_at");
  CREATE INDEX "enablers_created_at_idx" ON "enablers" USING btree ("created_at");
  CREATE UNIQUE INDEX "rai_dimensions_name_idx" ON "rai_dimensions" USING btree ("name");
  CREATE UNIQUE INDEX "rai_dimensions_slug_idx" ON "rai_dimensions" USING btree ("slug");
  CREATE INDEX "rai_dimensions_updated_at_idx" ON "rai_dimensions" USING btree ("updated_at");
  CREATE INDEX "rai_dimensions_created_at_idx" ON "rai_dimensions" USING btree ("created_at");
  CREATE UNIQUE INDEX "stakeholder_types_name_idx" ON "stakeholder_types" USING btree ("name");
  CREATE UNIQUE INDEX "stakeholder_types_slug_idx" ON "stakeholder_types" USING btree ("slug");
  CREATE INDEX "stakeholder_types_updated_at_idx" ON "stakeholder_types" USING btree ("updated_at");
  CREATE INDEX "stakeholder_types_created_at_idx" ON "stakeholder_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_name_idx" ON "tags" USING btree ("name");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "download_requests_email_idx" ON "download_requests" USING btree ("email");
  CREATE INDEX "download_requests_file_idx" ON "download_requests" USING btree ("file_id");
  CREATE INDEX "download_requests_updated_at_idx" ON "download_requests" USING btree ("updated_at");
  CREATE INDEX "download_requests_created_at_idx" ON "download_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "subscribers_rels_order_idx" ON "subscribers_rels" USING btree ("order");
  CREATE INDEX "subscribers_rels_parent_idx" ON "subscribers_rels" USING btree ("parent_id");
  CREATE INDEX "subscribers_rels_path_idx" ON "subscribers_rels" USING btree ("path");
  CREATE INDEX "subscribers_rels_topics_id_idx" ON "subscribers_rels" USING btree ("topics_id");
  CREATE INDEX "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");
  CREATE INDEX "event_registrations_email_idx" ON "event_registrations" USING btree ("email");
  CREATE INDEX "event_registrations_stakeholder_type_idx" ON "event_registrations" USING btree ("stakeholder_type_id");
  CREATE INDEX "event_registrations_updated_at_idx" ON "event_registrations" USING btree ("updated_at");
  CREATE INDEX "event_registrations_created_at_idx" ON "event_registrations" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_use_cases_id_idx" ON "search_rels" USING btree ("use_cases_id");
  CREATE INDEX "search_rels_publications_id_idx" ON "search_rels" USING btree ("publications_id");
  CREATE INDEX "search_rels_datasets_id_idx" ON "search_rels" USING btree ("datasets_id");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE INDEX "search_rels_op_eds_id_idx" ON "search_rels" USING btree ("op_eds_id");
  CREATE INDEX "search_rels_news_id_idx" ON "search_rels" USING btree ("news_id");
  CREATE INDEX "search_rels_people_id_idx" ON "search_rels" USING btree ("people_id");
  CREATE INDEX "search_rels_organisations_id_idx" ON "search_rels" USING btree ("organisations_id");
  CREATE INDEX "search_rels_events_id_idx" ON "search_rels" USING btree ("events_id");
  CREATE INDEX "search_rels_learning_resources_id_idx" ON "search_rels" USING btree ("learning_resources_id");
  CREATE INDEX "search_rels_opportunities_id_idx" ON "search_rels" USING btree ("opportunities_id");
  CREATE INDEX "search_rels_newsletters_id_idx" ON "search_rels" USING btree ("newsletters_id");
  CREATE INDEX "search_rels_indicators_id_idx" ON "search_rels" USING btree ("indicators_id");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_use_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("use_cases_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_datasets_id_idx" ON "payload_locked_documents_rels" USING btree ("datasets_id");
  CREATE INDEX "payload_locked_documents_rels_indicators_id_idx" ON "payload_locked_documents_rels" USING btree ("indicators_id");
  CREATE INDEX "payload_locked_documents_rels_indicator_values_id_idx" ON "payload_locked_documents_rels" USING btree ("indicator_values_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_op_eds_id_idx" ON "payload_locked_documents_rels" USING btree ("op_eds_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_organisations_id_idx" ON "payload_locked_documents_rels" USING btree ("organisations_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_learning_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("learning_resources_id");
  CREATE INDEX "payload_locked_documents_rels_opportunities_id_idx" ON "payload_locked_documents_rels" USING btree ("opportunities_id");
  CREATE INDEX "payload_locked_documents_rels_newsletters_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletters_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("topics_id");
  CREATE INDEX "payload_locked_documents_rels_enablers_id_idx" ON "payload_locked_documents_rels" USING btree ("enablers_id");
  CREATE INDEX "payload_locked_documents_rels_rai_dimensions_id_idx" ON "payload_locked_documents_rels" USING btree ("rai_dimensions_id");
  CREATE INDEX "payload_locked_documents_rels_stakeholder_types_id_idx" ON "payload_locked_documents_rels" USING btree ("stakeholder_types_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_download_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("download_requests_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_event_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("event_registrations_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_funders_order_idx" ON "site_settings_funders" USING btree ("_order");
  CREATE INDEX "site_settings_funders_parent_id_idx" ON "site_settings_funders" USING btree ("_parent_id");
  CREATE INDEX "site_settings_funders_logo_idx" ON "site_settings_funders" USING btree ("logo_id");
  CREATE INDEX "site_settings_partners_order_idx" ON "site_settings_partners" USING btree ("_order");
  CREATE INDEX "site_settings_partners_parent_id_idx" ON "site_settings_partners" USING btree ("_parent_id");
  CREATE INDEX "site_settings_partners_logo_idx" ON "site_settings_partners" USING btree ("logo_id");
  CREATE INDEX "home_audience_entries_order_idx" ON "home_audience_entries" USING btree ("_order");
  CREATE INDEX "home_audience_entries_parent_id_idx" ON "home_audience_entries" USING btree ("_parent_id");
  CREATE INDEX "home_featured_indicator_idx" ON "home" USING btree ("featured_indicator_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_use_cases_id_idx" ON "home_rels" USING btree ("use_cases_id");
  CREATE INDEX "home_rels_publications_id_idx" ON "home_rels" USING btree ("publications_id");
  CREATE INDEX "home_rels_datasets_id_idx" ON "home_rels" USING btree ("datasets_id");
  CREATE INDEX "home_rels_events_id_idx" ON "home_rels" USING btree ("events_id");
  CREATE INDEX "home_rels_posts_id_idx" ON "home_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "use_cases_links" CASCADE;
  DROP TABLE "use_cases" CASCADE;
  DROP TABLE "use_cases_rels" CASCADE;
  DROP TABLE "_use_cases_v_version_links" CASCADE;
  DROP TABLE "_use_cases_v" CASCADE;
  DROP TABLE "_use_cases_v_rels" CASCADE;
  DROP TABLE "publications" CASCADE;
  DROP TABLE "publications_rels" CASCADE;
  DROP TABLE "_publications_v" CASCADE;
  DROP TABLE "_publications_v_rels" CASCADE;
  DROP TABLE "datasets_files" CASCADE;
  DROP TABLE "datasets_access_links" CASCADE;
  DROP TABLE "datasets" CASCADE;
  DROP TABLE "datasets_rels" CASCADE;
  DROP TABLE "_datasets_v_version_files" CASCADE;
  DROP TABLE "_datasets_v_version_access_links" CASCADE;
  DROP TABLE "_datasets_v" CASCADE;
  DROP TABLE "_datasets_v_rels" CASCADE;
  DROP TABLE "indicators_status_labels" CASCADE;
  DROP TABLE "indicators" CASCADE;
  DROP TABLE "indicators_rels" CASCADE;
  DROP TABLE "indicator_values" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "op_eds" CASCADE;
  DROP TABLE "op_eds_rels" CASCADE;
  DROP TABLE "_op_eds_v" CASCADE;
  DROP TABLE "_op_eds_v_rels" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "people_links" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "people_rels" CASCADE;
  DROP TABLE "_people_v_version_links" CASCADE;
  DROP TABLE "_people_v" CASCADE;
  DROP TABLE "_people_v_rels" CASCADE;
  DROP TABLE "organisations" CASCADE;
  DROP TABLE "organisations_rels" CASCADE;
  DROP TABLE "_organisations_v" CASCADE;
  DROP TABLE "_organisations_v_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "learning_resources" CASCADE;
  DROP TABLE "learning_resources_rels" CASCADE;
  DROP TABLE "_learning_resources_v" CASCADE;
  DROP TABLE "_learning_resources_v_rels" CASCADE;
  DROP TABLE "opportunities" CASCADE;
  DROP TABLE "opportunities_rels" CASCADE;
  DROP TABLE "_opportunities_v" CASCADE;
  DROP TABLE "_opportunities_v_rels" CASCADE;
  DROP TABLE "newsletters" CASCADE;
  DROP TABLE "newsletters_rels" CASCADE;
  DROP TABLE "_newsletters_v" CASCADE;
  DROP TABLE "_newsletters_v_rels" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "topics" CASCADE;
  DROP TABLE "enablers" CASCADE;
  DROP TABLE "rai_dimensions" CASCADE;
  DROP TABLE "stakeholder_types" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "download_requests" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "subscribers_rels" CASCADE;
  DROP TABLE "event_registrations" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings_funders" CASCADE;
  DROP TABLE "site_settings_partners" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_audience_entries" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_use_cases_stage";
  DROP TYPE "public"."enum_use_cases_provenance";
  DROP TYPE "public"."enum_use_cases_status";
  DROP TYPE "public"."enum__use_cases_v_version_stage";
  DROP TYPE "public"."enum__use_cases_v_version_provenance";
  DROP TYPE "public"."enum__use_cases_v_version_status";
  DROP TYPE "public"."enum__use_cases_v_published_locale";
  DROP TYPE "public"."enum_publications_type";
  DROP TYPE "public"."enum_publications_provenance";
  DROP TYPE "public"."enum_publications_status";
  DROP TYPE "public"."enum__publications_v_version_type";
  DROP TYPE "public"."enum__publications_v_version_provenance";
  DROP TYPE "public"."enum__publications_v_version_status";
  DROP TYPE "public"."enum__publications_v_published_locale";
  DROP TYPE "public"."enum_datasets_licence";
  DROP TYPE "public"."enum_datasets_provenance";
  DROP TYPE "public"."enum_datasets_status";
  DROP TYPE "public"."enum__datasets_v_version_licence";
  DROP TYPE "public"."enum__datasets_v_version_provenance";
  DROP TYPE "public"."enum__datasets_v_version_status";
  DROP TYPE "public"."enum__datasets_v_published_locale";
  DROP TYPE "public"."enum_indicators_value_type";
  DROP TYPE "public"."enum_indicators_provenance";
  DROP TYPE "public"."enum_indicator_values_provenance";
  DROP TYPE "public"."enum_posts_provenance";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_provenance";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_op_eds_provenance";
  DROP TYPE "public"."enum_op_eds_status";
  DROP TYPE "public"."enum__op_eds_v_version_provenance";
  DROP TYPE "public"."enum__op_eds_v_version_status";
  DROP TYPE "public"."enum__op_eds_v_published_locale";
  DROP TYPE "public"."enum_news_provenance";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_provenance";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_people_affiliation";
  DROP TYPE "public"."enum_people_provenance";
  DROP TYPE "public"."enum_people_status";
  DROP TYPE "public"."enum__people_v_version_affiliation";
  DROP TYPE "public"."enum__people_v_version_provenance";
  DROP TYPE "public"."enum__people_v_version_status";
  DROP TYPE "public"."enum__people_v_published_locale";
  DROP TYPE "public"."enum_organisations_observatory_role";
  DROP TYPE "public"."enum_organisations_provenance";
  DROP TYPE "public"."enum_organisations_status";
  DROP TYPE "public"."enum__organisations_v_version_observatory_role";
  DROP TYPE "public"."enum__organisations_v_version_provenance";
  DROP TYPE "public"."enum__organisations_v_version_status";
  DROP TYPE "public"."enum__organisations_v_published_locale";
  DROP TYPE "public"."enum_events_format";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_events_registration_mode";
  DROP TYPE "public"."enum_events_provenance";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_format";
  DROP TYPE "public"."enum__events_v_version_event_type";
  DROP TYPE "public"."enum__events_v_version_registration_mode";
  DROP TYPE "public"."enum__events_v_version_provenance";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_learning_resources_resource_type";
  DROP TYPE "public"."enum_learning_resources_level";
  DROP TYPE "public"."enum_learning_resources_provenance";
  DROP TYPE "public"."enum_learning_resources_status";
  DROP TYPE "public"."enum__learning_resources_v_version_resource_type";
  DROP TYPE "public"."enum__learning_resources_v_version_level";
  DROP TYPE "public"."enum__learning_resources_v_version_provenance";
  DROP TYPE "public"."enum__learning_resources_v_version_status";
  DROP TYPE "public"."enum__learning_resources_v_published_locale";
  DROP TYPE "public"."enum_opportunities_opportunity_type";
  DROP TYPE "public"."enum_opportunities_provenance";
  DROP TYPE "public"."enum_opportunities_status";
  DROP TYPE "public"."enum__opportunities_v_version_opportunity_type";
  DROP TYPE "public"."enum__opportunities_v_version_provenance";
  DROP TYPE "public"."enum__opportunities_v_version_status";
  DROP TYPE "public"."enum__opportunities_v_published_locale";
  DROP TYPE "public"."enum_newsletters_provenance";
  DROP TYPE "public"."enum_newsletters_status";
  DROP TYPE "public"."enum__newsletters_v_version_provenance";
  DROP TYPE "public"."enum__newsletters_v_version_status";
  DROP TYPE "public"."enum__newsletters_v_published_locale";
  DROP TYPE "public"."enum_pages_provenance";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_provenance";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_countries_subregion";
  DROP TYPE "public"."enum_subscribers_status";
  DROP TYPE "public"."enum_event_registrations_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_access";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
