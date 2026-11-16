export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      account_devices: {
        Row: {
          app_version: string | null
          device_id: string
          first_seen_at: string
          keeper_id: string
          last_seen_at: string
          name: string | null
          pending_changes: number | null
          pending_reported_at: string | null
          platform: string
          signed_out_at: string | null
          synced_at: string | null
        }
        Insert: {
          app_version?: string | null
          device_id: string
          first_seen_at?: string
          keeper_id: string
          last_seen_at?: string
          name?: string | null
          pending_changes?: number | null
          pending_reported_at?: string | null
          platform: string
          signed_out_at?: string | null
          synced_at?: string | null
        }
        Update: {
          app_version?: string | null
          device_id?: string
          first_seen_at?: string
          keeper_id?: string
          last_seen_at?: string
          name?: string | null
          pending_changes?: number | null
          pending_reported_at?: string | null
          platform?: string
          signed_out_at?: string | null
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_devices_keeper_id_fkey"
            columns: ["keeper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      activity_log: {
        Row: {
          action: string
          actor_contact_id: string | null
          actor_name: string | null
          approved_by_contact_id: string | null
          approved_by_name: string | null
          at: string
          created_at: string
          id: string
          store_id: string
          subject_id: string | null
          subject_label: string | null
          subject_type: string | null
          summary: string
          updated_at: string
        }
        Insert: {
          action: string
          actor_contact_id?: string | null
          actor_name?: string | null
          approved_by_contact_id?: string | null
          approved_by_name?: string | null
          at?: string
          created_at?: string
          id: string
          store_id: string
          subject_id?: string | null
          subject_label?: string | null
          subject_type?: string | null
          summary: string
          updated_at?: string
        }
        Update: {
          action?: string
          actor_contact_id?: string | null
          actor_name?: string | null
          approved_by_contact_id?: string | null
          approved_by_name?: string | null
          at?: string
          created_at?: string
          id?: string
          store_id?: string
          subject_id?: string | null
          subject_label?: string | null
          subject_type?: string | null
          summary?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_images: {
        Row: {
          ad_id: string
          created_at: string
          deleted_at: string | null
          id: string
          is_default: boolean
          url: string
        }
        Insert: {
          ad_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          url: string
        }
        Update: {
          ad_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_images_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_images_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads_list_view"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_likes: {
        Row: {
          ad_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          ad_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          ad_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_likes_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_likes_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads_list_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ad_ratings: {
        Row: {
          ad_id: string
          created_at: string
          deleted_at: string | null
          id: string
          score: number
          user_id: string
        }
        Insert: {
          ad_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          score: number
          user_id: string
        }
        Update: {
          ad_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_ratings_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_ratings_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads_list_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ad_review_replies: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          message: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          message: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          message?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "ad_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_review_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ad_reviews: {
        Row: {
          ad_id: string
          created_at: string
          deleted_at: string | null
          id: string
          message: string
          user_id: string
        }
        Insert: {
          ad_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          message: string
          user_id: string
        }
        Update: {
          ad_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_reviews_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_reviews_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads_list_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ad_views: {
        Row: {
          ad_id: string
          user_id: string
          view_count: number
          viewed_at: string
        }
        Insert: {
          ad_id: string
          user_id: string
          view_count?: number
          viewed_at?: string
        }
        Update: {
          ad_id?: string
          user_id?: string
          view_count?: number
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_views_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_views_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads_list_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      addresses: {
        Row: {
          address: string
          area: string | null
          created_at: string
          deleted_at: string | null
          id: string
          instructions: string | null
          is_default: boolean
          label: string
          location: unknown
          phone: string | null
          profile_id: string
          recipient_name: string | null
          updated_at: string
        }
        Insert: {
          address: string
          area?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          instructions?: string | null
          is_default?: boolean
          label: string
          location?: unknown
          phone?: string | null
          profile_id: string
          recipient_name?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          area?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          instructions?: string | null
          is_default?: boolean
          label?: string
          location?: unknown
          phone?: string | null
          profile_id?: string
          recipient_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ads: {
        Row: {
          address: string | null
          category_slug: string | null
          category_source: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          embedding: string | null
          id: string
          is_featured: boolean
          is_new: boolean
          listed_quantity: number | null
          location: unknown
          product_id: string
          seller_id: string
          specs: Json | null
          status: string
          store_id: string
          sub_category_slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          category_slug?: string | null
          category_source?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          embedding?: string | null
          id?: string
          is_featured?: boolean
          is_new?: boolean
          listed_quantity?: number | null
          location?: unknown
          product_id: string
          seller_id: string
          specs?: Json | null
          status?: string
          store_id: string
          sub_category_slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          category_slug?: string | null
          category_source?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          embedding?: string | null
          id?: string
          is_featured?: boolean
          is_new?: boolean
          listed_quantity?: number | null
          location?: unknown
          product_id?: string
          seller_id?: string
          specs?: Json | null
          status?: string
          store_id?: string
          sub_category_slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "ads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "ads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ads_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_sub_category_slug_fkey"
            columns: ["sub_category_slug"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      app_releases: {
        Row: {
          app: string
          created_at: string
          download_url: string
          id: string
          min_supported_version_code: number | null
          notes: string | null
          platform: string
          published_at: string
          version: string
          version_code: number
        }
        Insert: {
          app: string
          created_at?: string
          download_url: string
          id?: string
          min_supported_version_code?: number | null
          notes?: string | null
          platform: string
          published_at?: string
          version: string
          version_code: number
        }
        Update: {
          app?: string
          created_at?: string
          download_url?: string
          id?: string
          min_supported_version_code?: number | null
          notes?: string | null
          platform?: string
          published_at?: string
          version?: string
          version_code?: number
        }
        Relationships: []
      }
      areas: {
        Row: {
          city: string
          created_at: string
          id: string
          kind: string | null
          location: unknown
          name: string
          osm_id: number | null
          osm_type: string | null
          source: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          kind?: string | null
          location: unknown
          name: string
          osm_id?: number | null
          osm_type?: string | null
          source?: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          kind?: string | null
          location?: unknown
          name?: string
          osm_id?: number | null
          osm_type?: string | null
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      base_units: {
        Row: {
          abbr: string | null
          created_at: string
          id: string
          kind: string
          name: string
          plural: string | null
        }
        Insert: {
          abbr?: string | null
          created_at?: string
          id?: string
          kind: string
          name: string
          plural?: string | null
        }
        Update: {
          abbr?: string | null
          created_at?: string
          id?: string
          kind?: string
          name?: string
          plural?: string | null
        }
        Relationships: []
      }
      batch_counts: {
        Row: {
          batch_id: string
          created_at: string
          damage_id: string | null
          id: string
          physical_count_id: string
          product_id: string
          resolved_at: string | null
          resolved_by: string | null
          resolved_by_name: string | null
          shelf_count: number
          status: string
          system_count: number
          updated_at: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          damage_id?: string | null
          id: string
          physical_count_id: string
          product_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_name?: string | null
          shelf_count: number
          status?: string
          system_count: number
          updated_at?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          damage_id?: string | null
          id?: string
          physical_count_id?: string
          product_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_name?: string | null
          shelf_count?: number
          status?: string
          system_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_counts_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_counts_physical_count_id_fkey"
            columns: ["physical_count_id"]
            isOneToOne: false
            referencedRelation: "physical_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_counts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "batch_counts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_pricings: {
        Row: {
          batch_id: string
          pricing_id: string
        }
        Insert: {
          batch_id: string
          pricing_id: string
        }
        Update: {
          batch_id?: string
          pricing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_pricings_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_pricings_pricing_id_fkey"
            columns: ["pricing_id"]
            isOneToOne: false
            referencedRelation: "product_pricings"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          ciphertext: string
          created_at: string
          deleted_at: string | null
          id: string
          nonce: string
          receiver_id: string
          sender_id: string
          sender_key_id: string
          status: string
        }
        Insert: {
          ciphertext: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          nonce: string
          receiver_id: string
          sender_id: string
          sender_key_id: string
          status?: string
        }
        Update: {
          ciphertext?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          nonce?: string
          receiver_id?: string
          sender_id?: string
          sender_key_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      clients: {
        Row: {
          contact_id: string
          created_at: string
          deleted_at: string | null
          id: string
          store_id: string
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          store_id: string
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "store_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      currency_rates: {
        Row: {
          base: string
          code: string
          rate: number
          updated_at: string
        }
        Insert: {
          base: string
          code: string
          rate: number
          updated_at?: string
        }
        Update: {
          base?: string
          code?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          created_at: string
          deleted_at: string | null
          delivery_time: number
          distance: number
          distance_units: string
          id: string
          price: number
          store_id: string
          time_units: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          delivery_time: number
          distance: number
          distance_units?: string
          id?: string
          price: number
          store_id: string
          time_units?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          delivery_time?: number
          distance?: number
          distance_units?: string
          id?: string
          price?: number
          store_id?: string
          time_units?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_zones_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_zones_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          app_version: string | null
          created_at: string
          device_id: string
          keeper_id: string
          platform: string
          store_ids: string[]
          token: string
          updated_at: string
        }
        Insert: {
          app_version?: string | null
          created_at?: string
          device_id: string
          keeper_id: string
          platform: string
          store_ids?: string[]
          token: string
          updated_at?: string
        }
        Update: {
          app_version?: string | null
          created_at?: string
          device_id?: string
          keeper_id?: string
          platform?: string
          store_ids?: string[]
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          deleted_at: string | null
          description: string
          id: string
          store_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency: string
          deleted_at?: string | null
          description: string
          id?: string
          store_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string
          id?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "expenses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          allow_follow_up: boolean
          app_version: string | null
          category: string
          contact_email: string | null
          created_at: string
          id: string
          message: string
          store_id: string | null
          user_id: string
        }
        Insert: {
          allow_follow_up?: boolean
          app_version?: string | null
          category: string
          contact_email?: string | null
          created_at?: string
          id?: string
          message: string
          store_id?: string | null
          user_id?: string
        }
        Update: {
          allow_follow_up?: boolean
          app_version?: string | null
          category?: string
          contact_email?: string | null
          created_at?: string
          id?: string
          message?: string
          store_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          id: string
          order_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders_view"
            referencedColumns: ["id"]
          },
        ]
      }
      lilli_manual_chunks: {
        Row: {
          access_tag: string
          chunk_index: number
          content: string
          created_at: string
          embedding: string | null
          heading: string
          id: number
          updated_at: string
        }
        Insert: {
          access_tag: string
          chunk_index: number
          content: string
          created_at?: string
          embedding?: string | null
          heading: string
          id?: never
          updated_at?: string
        }
        Update: {
          access_tag?: string
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string | null
          heading?: string
          id?: never
          updated_at?: string
        }
        Relationships: []
      }
      lilli_market_manual_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          embedding: string | null
          heading: string
          id: number
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          embedding?: string | null
          heading: string
          id?: never
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string | null
          heading?: string
          id?: never
        }
        Relationships: []
      }
      lilli_market_usage: {
        Row: {
          day: string
          messages: number
          updated_at: string
          user_id: string
        }
        Insert: {
          day: string
          messages?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          day?: string
          messages?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lilli_market_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lilli_usage: {
        Row: {
          messages: number
          month: string
          updated_at: string
          user_id: string
        }
        Insert: {
          messages?: number
          month: string
          updated_at?: string
          user_id: string
        }
        Update: {
          messages?: number
          month?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lilli_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notes: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          store_id: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          store_id: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          store_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          keeper_id: string
          kind: string
          pushed_at: string | null
          read_at: string | null
          ref_id: string | null
          ref_table: string | null
          store_id: string | null
          title: string
          updated_at: string
          urgent: boolean
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          keeper_id: string
          kind: string
          pushed_at?: string | null
          read_at?: string | null
          ref_id?: string | null
          ref_table?: string | null
          store_id?: string | null
          title: string
          updated_at?: string
          urgent?: boolean
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          keeper_id?: string
          kind?: string
          pushed_at?: string | null
          read_at?: string | null
          ref_id?: string | null
          ref_table?: string | null
          store_id?: string | null
          title?: string
          updated_at?: string
          urgent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notifications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_deliveries: {
        Row: {
          assigned_at: string
          delivered_at: string | null
          order_id: string
          picked_up_at: string | null
          rider_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          delivered_at?: string | null
          order_id: string
          picked_up_at?: string | null
          rider_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          delivered_at?: string | null
          order_id?: string
          picked_up_at?: string | null
          rider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_deliveries_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_batches: {
        Row: {
          batch_id: string
          order_item_id: string
          quantity: number
        }
        Insert: {
          batch_id: string
          order_item_id: string
          quantity: number
        }
        Update: {
          batch_id?: string
          order_item_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_batches_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_batches_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_returns: {
        Row: {
          created_at: string
          id: string
          order_item_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_item_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_item_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_returns_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          pricing_id: string
          product_id: string
          quantity: number
          returned: number
          specs: Json | null
          units: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          pricing_id: string
          product_id: string
          quantity: number
          returned?: number
          specs?: Json | null
          units?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          pricing_id?: string
          product_id?: string
          quantity?: number
          returned?: number
          specs?: Json | null
          units?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_pricing_id_fkey"
            columns: ["pricing_id"]
            isOneToOne: false
            referencedRelation: "product_pricings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          order_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method?: string
          order_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_view"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          buyer_profile_id: string | null
          channel: string
          client_id: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          deleted_by: string[]
          delivery_address: Json | null
          delivery_fee: number
          discount: number
          fulfilment_status: string
          fulfilment_type: string | null
          has_returns: boolean
          id: string
          message: string | null
          payment_details: Json | null
          payment_method: string | null
          payment_status: string
          received: number
          service_fee: number
          staff_id: string | null
          store_id: string
          tip: number
          updated_at: string
        }
        Insert: {
          amount?: number
          buyer_profile_id?: string | null
          channel: string
          client_id?: string | null
          created_at?: string
          currency: string
          deleted_at?: string | null
          deleted_by?: string[]
          delivery_address?: Json | null
          delivery_fee?: number
          discount?: number
          fulfilment_status?: string
          fulfilment_type?: string | null
          has_returns?: boolean
          id?: string
          message?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          payment_status?: string
          received?: number
          service_fee?: number
          staff_id?: string | null
          store_id: string
          tip?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_profile_id?: string | null
          channel?: string
          client_id?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          deleted_by?: string[]
          delivery_address?: Json | null
          delivery_fee?: number
          discount?: number
          fulfilment_status?: string
          fulfilment_type?: string | null
          has_returns?: boolean
          id?: string
          message?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          payment_status?: string
          received?: number
          service_fee?: number
          staff_id?: string | null
          store_id?: string
          tip?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_profile_id_fkey"
            columns: ["buyer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "store_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_counts: {
        Row: {
          counted_at: string
          counted_by: string | null
          counted_by_name: string | null
          created_at: string
          id: string
          note: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          counted_at?: string
          counted_by?: string | null
          counted_by_name?: string | null
          created_at?: string
          id: string
          note?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          counted_at?: string
          counted_by?: string | null
          counted_by_name?: string | null
          created_at?: string
          id?: string
          note?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "physical_counts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_counts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_limits: {
        Row: {
          combined_reports: boolean
          currency: string
          devices: number | null
          devices_per_store: boolean
          email_recipients: number | null
          extra_store_price: number | null
          featured_listings: boolean
          items: number | null
          lilli_messages: number | null
          listings: number | null
          log_days: number | null
          marketplace: boolean
          monthly_price: number
          pdf_export: boolean
          plan: string
          promotions: boolean
          rank: number
          report_days: number | null
          report_email_frequency: string
          staff: number | null
          staff_permissions: string
          stores: number | null
          suppliers: number | null
          updated_at: string
        }
        Insert: {
          combined_reports: boolean
          currency?: string
          devices?: number | null
          devices_per_store?: boolean
          email_recipients?: number | null
          extra_store_price?: number | null
          featured_listings: boolean
          items?: number | null
          lilli_messages?: number | null
          listings?: number | null
          log_days?: number | null
          marketplace: boolean
          monthly_price?: number
          pdf_export: boolean
          plan: string
          promotions: boolean
          rank: number
          report_days?: number | null
          report_email_frequency: string
          staff?: number | null
          staff_permissions: string
          stores?: number | null
          suppliers?: number | null
          updated_at?: string
        }
        Update: {
          combined_reports?: boolean
          currency?: string
          devices?: number | null
          devices_per_store?: boolean
          email_recipients?: number | null
          extra_store_price?: number | null
          featured_listings?: boolean
          items?: number | null
          lilli_messages?: number | null
          listings?: number | null
          log_days?: number | null
          marketplace?: boolean
          monthly_price?: number
          pdf_export?: boolean
          plan?: string
          promotions?: boolean
          rank?: number
          report_days?: number | null
          report_email_frequency?: string
          staff?: number | null
          staff_permissions?: string
          stores?: number | null
          suppliers?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      product_batches: {
        Row: {
          available: number
          batch_number: string
          buying_price: number | null
          created_at: string
          currency: string | null
          deleted_at: string | null
          expiry_date: string | null
          id: string
          manufacture_date: string | null
          product_id: string
          quantity: number
          units: string
          updated_at: string
        }
        Insert: {
          available: number
          batch_number: string
          buying_price?: number | null
          created_at?: string
          currency?: string | null
          deleted_at?: string | null
          expiry_date?: string | null
          id?: string
          manufacture_date?: string | null
          product_id: string
          quantity: number
          units: string
          updated_at?: string
        }
        Update: {
          available?: number
          batch_number?: string
          buying_price?: number | null
          created_at?: string
          currency?: string | null
          deleted_at?: string | null
          expiry_date?: string | null
          id?: string
          manufacture_date?: string | null
          product_id?: string
          quantity?: number
          units?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_batches_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "product_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_default: boolean
          path: string
          product_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          path: string
          product_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          path?: string
          product_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_pricings: {
        Row: {
          amount: number
          created_at: string
          currency: string
          deleted_at: string | null
          details: Json | null
          discount: number | null
          flash_amount: number | null
          flash_expires_at: string | null
          flash_starts_at: string | null
          id: string
          product_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          deleted_at?: string | null
          details?: Json | null
          discount?: number | null
          flash_amount?: number | null
          flash_expires_at?: string | null
          flash_starts_at?: string | null
          id?: string
          product_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          deleted_at?: string | null
          details?: Json | null
          discount?: number | null
          flash_amount?: number | null
          flash_expires_at?: string | null
          flash_starts_at?: string | null
          id?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_pricings_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "product_pricings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_pricings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_suppliers: {
        Row: {
          conversion_factor: number | null
          created_at: string
          product_id: string
          supplier_id: string
          supplier_product_id: string | null
          supplier_sku: string | null
          updated_at: string
        }
        Insert: {
          conversion_factor?: number | null
          created_at?: string
          product_id: string
          supplier_id: string
          supplier_product_id?: string | null
          supplier_sku?: string | null
          updated_at?: string
        }
        Update: {
          conversion_factor?: number | null
          created_at?: string
          product_id?: string
          supplier_id?: string
          supplier_product_id?: string | null
          supplier_sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_suppliers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_suppliers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_label: string
          category_slug: string | null
          category_source: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          images: Json | null
          low_stock_threshold: number
          name: string
          price_determinants: Json | null
          pricing_scheme: string
          quantity: number | null
          sku: string | null
          specs: Json | null
          store_id: string
          sub_category_label: string | null
          sub_category_slug: string | null
          upc: string | null
          updated_at: string
        }
        Insert: {
          category_label: string
          category_slug?: string | null
          category_source?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          low_stock_threshold?: number
          name: string
          price_determinants?: Json | null
          pricing_scheme: string
          quantity?: number | null
          sku?: string | null
          specs?: Json | null
          store_id: string
          sub_category_label?: string | null
          sub_category_slug?: string | null
          upc?: string | null
          updated_at?: string
        }
        Update: {
          category_label?: string
          category_slug?: string | null
          category_source?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          low_stock_threshold?: number
          name?: string
          price_determinants?: Json | null
          pricing_scheme?: string
          quantity?: number | null
          sku?: string | null
          specs?: Json | null
          store_id?: string
          sub_category_label?: string | null
          sub_category_slug?: string | null
          upc?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sub_category_slug_fkey"
            columns: ["sub_category_slug"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          created_at: string
          default_address: string | null
          deleted_at: string | null
          full_name: string | null
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string
          default_address?: string | null
          deleted_at?: string | null
          full_name?: string | null
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string
          default_address?: string | null
          deleted_at?: string | null
          full_name?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      remittance_accounts: {
        Row: {
          created_at: string
          id: string
          providers: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          providers?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          providers?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "remittance_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      report_email_recipients: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          store_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          store_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_email_recipients_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_email_recipients_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_locations: {
        Row: {
          accuracy_m: number | null
          heading: number | null
          location: unknown
          recorded_at: string
          rider_id: string
          speed_mps: number | null
        }
        Insert: {
          accuracy_m?: number | null
          heading?: number | null
          location: unknown
          recorded_at?: string
          rider_id: string
          speed_mps?: number | null
        }
        Update: {
          accuracy_m?: number | null
          heading?: number | null
          location?: unknown
          recorded_at?: string
          rider_id?: string
          speed_mps?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_locations_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: true
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          profile_id: string
          updated_at: string
          vehicle: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          profile_id: string
          updated_at?: string
          vehicle?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          profile_id?: string
          updated_at?: string
          vehicle?: string
        }
        Relationships: [
          {
            foreignKeyName: "riders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      stock_damages: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          note: string | null
          product_id: string
          quantity: number
          reason: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          id: string
          note?: string | null
          product_id: string
          quantity: number
          reason: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          note?: string | null
          product_id?: string
          quantity?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_damages_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_damages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_damages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_contacts: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          id: string
          keeper_id: string
          linked_profile_id: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          keeper_id: string
          linked_profile_id?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          keeper_id?: string
          linked_profile_id?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_contacts_linked_profile_id_fkey"
            columns: ["linked_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      store_likes: {
        Row: {
          created_at: string
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_likes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_likes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      store_ratings: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          score: number
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          score: number
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          score?: number
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_ratings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_ratings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      store_reviews: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          message: string
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          message: string
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          message?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      store_settings: {
        Row: {
          allow_barcode_scanning: boolean
          auto_generate_barcodes: boolean
          auto_reorder: boolean
          created_at: string
          daily_report_enabled: boolean
          daily_report_hour: number
          daily_report_minute: number
          default_currency: string
          efris_enabled: boolean
          locked_rates: Json
          loyalty_amount_spent: number | null
          loyalty_enabled: boolean
          loyalty_points: number | null
          monthly_report_day: string
          monthly_report_enabled: boolean
          negative_stock_policy: string
          notify_customer_review: boolean
          notify_lilli_suggestions: boolean
          notify_low_inventory: boolean
          notify_new_orders: boolean
          notify_promotional_updates: boolean
          print_barcode_labels: boolean
          push_notification_mode: string
          store_id: string
          tip_percentage: number | null
          tip_rules: Json | null
          tippable_amount: number | null
          tips_enabled: boolean
          updated_at: string
          vat_mode: string
          vat_percentage: number | null
          vibration_enabled: boolean
          weekly_report_day: string
          weekly_report_enabled: boolean
        }
        Insert: {
          allow_barcode_scanning?: boolean
          auto_generate_barcodes?: boolean
          auto_reorder?: boolean
          created_at?: string
          daily_report_enabled?: boolean
          daily_report_hour?: number
          daily_report_minute?: number
          default_currency?: string
          efris_enabled?: boolean
          locked_rates?: Json
          loyalty_amount_spent?: number | null
          loyalty_enabled?: boolean
          loyalty_points?: number | null
          monthly_report_day?: string
          monthly_report_enabled?: boolean
          negative_stock_policy?: string
          notify_customer_review?: boolean
          notify_lilli_suggestions?: boolean
          notify_low_inventory?: boolean
          notify_new_orders?: boolean
          notify_promotional_updates?: boolean
          print_barcode_labels?: boolean
          push_notification_mode?: string
          store_id: string
          tip_percentage?: number | null
          tip_rules?: Json | null
          tippable_amount?: number | null
          tips_enabled?: boolean
          updated_at?: string
          vat_mode?: string
          vat_percentage?: number | null
          vibration_enabled?: boolean
          weekly_report_day?: string
          weekly_report_enabled?: boolean
        }
        Update: {
          allow_barcode_scanning?: boolean
          auto_generate_barcodes?: boolean
          auto_reorder?: boolean
          created_at?: string
          daily_report_enabled?: boolean
          daily_report_hour?: number
          daily_report_minute?: number
          default_currency?: string
          efris_enabled?: boolean
          locked_rates?: Json
          loyalty_amount_spent?: number | null
          loyalty_enabled?: boolean
          loyalty_points?: number | null
          monthly_report_day?: string
          monthly_report_enabled?: boolean
          negative_stock_policy?: string
          notify_customer_review?: boolean
          notify_lilli_suggestions?: boolean
          notify_low_inventory?: boolean
          notify_new_orders?: boolean
          notify_promotional_updates?: boolean
          print_barcode_labels?: boolean
          push_notification_mode?: string
          store_id?: string
          tip_percentage?: number | null
          tip_rules?: Json | null
          tippable_amount?: number | null
          tips_enabled?: boolean
          updated_at?: string
          vat_mode?: string
          vat_percentage?: number | null
          vibration_enabled?: boolean
          weekly_report_day?: string
          weekly_report_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "store_settings_default_currency_fkey"
            columns: ["default_currency"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "store_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_staff: {
        Row: {
          contact_id: string
          created_at: string
          deleted_at: string | null
          failed_attempts: number
          id: string
          is_admin: boolean
          keeper_id: string
          locked_until: string | null
          pass_key_hash: string
          pass_key_salt: string
          permissions: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          deleted_at?: string | null
          failed_attempts?: number
          id?: string
          is_admin?: boolean
          keeper_id: string
          locked_until?: string | null
          pass_key_hash?: string
          pass_key_salt?: string
          permissions?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          deleted_at?: string | null
          failed_attempts?: number
          id?: string
          is_admin?: boolean
          keeper_id?: string
          locked_until?: string | null
          pass_key_hash?: string
          pass_key_salt?: string
          permissions?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_staff_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "store_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      store_staff_stores: {
        Row: {
          created_at: string
          role: string | null
          staff_id: string
          store_id: string
        }
        Insert: {
          created_at?: string
          role?: string | null
          staff_id: string
          store_id: string
        }
        Update: {
          created_at?: string
          role?: string | null
          staff_id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_staff_stores_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "store_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_staff_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_staff_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_views: {
        Row: {
          store_id: string
          user_id: string
          view_count: number
          viewed_at: string
        }
        Insert: {
          store_id: string
          user_id: string
          view_count?: number
          viewed_at?: string
        }
        Update: {
          store_id?: string
          user_id?: string
          view_count?: number
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_views_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_views_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      stores: {
        Row: {
          accepted_currency_codes: string[]
          accepted_payment_method_codes: string[]
          address: string | null
          category: string
          cover_image: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_supplier: boolean
          is_wholesaler: boolean
          keeper_id: string
          location: unknown
          logo: string | null
          marketplace_published_at: string | null
          name: string
          offer_delivery: boolean
          slug: string | null
          status: string
          updated_at: string
        }
        Insert: {
          accepted_currency_codes?: string[]
          accepted_payment_method_codes?: string[]
          address?: string | null
          category?: string
          cover_image?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_supplier?: boolean
          is_wholesaler?: boolean
          keeper_id: string
          location?: unknown
          logo?: string | null
          marketplace_published_at?: string | null
          name: string
          offer_delivery?: boolean
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_currency_codes?: string[]
          accepted_payment_method_codes?: string[]
          address?: string | null
          category?: string
          cover_image?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_supplier?: boolean
          is_wholesaler?: boolean
          keeper_id?: string
          location?: unknown
          logo?: string | null
          marketplace_published_at?: string | null
          name?: string
          offer_delivery?: boolean
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          category_slug: string
          created_at: string
          name: string
          slug: string
        }
        Insert: {
          category_slug: string
          created_at?: string
          name: string
          slug: string
        }
        Update: {
          category_slug?: string
          created_at?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      sub_units: {
        Row: {
          abbr: string | null
          base_unit_id: string
          conversion_factor: number
          created_at: string
          id: string
          name: string
          plural: string | null
        }
        Insert: {
          abbr?: string | null
          base_unit_id: string
          conversion_factor: number
          created_at?: string
          id?: string
          name: string
          plural?: string | null
        }
        Update: {
          abbr?: string | null
          base_unit_id?: string
          conversion_factor?: number
          created_at?: string
          id?: string
          name?: string
          plural?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_units_base_unit_id_fkey"
            columns: ["base_unit_id"]
            isOneToOne: false
            referencedRelation: "base_units"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          extra_stores: number
          id: string
          period: string | null
          plan: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          extra_stores?: number
          id?: string
          period?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          extra_stores?: number
          id?: string
          period?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      supplier_link_suggestions: {
        Row: {
          created_at: string
          id: string
          resolved_at: string | null
          status: string
          store_id: string
          suggested_store_id: string
          supplier_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: string
          store_id: string
          suggested_store_id: string
          supplier_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: string
          store_id?: string
          suggested_store_id?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_link_suggestions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_link_suggestions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_link_suggestions_suggested_store_id_fkey"
            columns: ["suggested_store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_link_suggestions_suggested_store_id_fkey"
            columns: ["suggested_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_link_suggestions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact_id: string
          created_at: string
          deleted_at: string | null
          id: string
          store_id: string
          supplier_store_id: string | null
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          store_id: string
          supplier_store_id?: string | null
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          store_id?: string
          supplier_store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "store_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_supplier_store_id_fkey"
            columns: ["supplier_store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_supplier_store_id_fkey"
            columns: ["supplier_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          details: Json
          id: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      working_hours: {
        Row: {
          close_minute_of_day: number
          day: string
          deleted_at: string | null
          id: string
          open_24_hours: boolean
          open_minute_of_day: number
          status: string
          store_id: string
        }
        Insert: {
          close_minute_of_day?: number
          day: string
          deleted_at?: string | null
          id?: string
          open_24_hours?: boolean
          open_minute_of_day?: number
          status?: string
          store_id: string
        }
        Update: {
          close_minute_of_day?: number
          day?: string
          deleted_at?: string | null
          id?: string
          open_24_hours?: boolean
          open_minute_of_day?: number
          status?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "working_hours_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_hours_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ads_list_view: {
        Row: {
          address: string | null
          category_label: string | null
          category_slug: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          is_new: boolean | null
          likes: number | null
          location: unknown
          price: Json | null
          product_id: string | null
          product_name: string | null
          quantity: number | null
          rating: number | null
          ratings: number | null
          reviews: number | null
          seller_id: string | null
          sku: string | null
          specs: Json | null
          status: string | null
          stock_available: number | null
          store_id: string | null
          store_logo: string | null
          store_name: string | null
          store_slug: string | null
          sub_category_label: string | null
          sub_category_slug: string | null
          title: string | null
          upc: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "ads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "ads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ads_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_sub_category_slug_fkey"
            columns: ["sub_category_slug"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      inventory: {
        Row: {
          available: number | null
          batch_count: number | null
          category_label: string | null
          currency: string | null
          earliest_expiry: string | null
          is_low_stock: boolean | null
          listed_ads: number | null
          low_stock_threshold: number | null
          name: string | null
          price: number | null
          pricing_scheme: string | null
          product_id: string | null
          sku: string | null
          store_id: string | null
          sub_category_label: string | null
          upc: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_pricings_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_view: {
        Row: {
          amount: number | null
          balance: number | null
          buyer_name: string | null
          buyer_profile_id: string | null
          channel: string | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          currency: string | null
          date: string | null
          delivery_address: Json | null
          discount: number | null
          fulfilment_status: string | null
          id: string | null
          item_count: number | null
          items: Json | null
          message: string | null
          payment_status: string | null
          received: number | null
          staff_id: string | null
          store_id: string | null
          store_logo: string | null
          store_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_profile_id_fkey"
            columns: ["buyer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "store_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_view: {
        Row: {
          about: string | null
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          name: string | null
          user_id: string | null
        }
        Relationships: []
      }
      store_data: {
        Row: {
          accepted_currency_codes: string[] | null
          accepted_payment_method_codes: string[] | null
          ad_count: number | null
          address: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string | null
          keeper_avatar_url: string | null
          keeper_id: string | null
          keeper_name: string | null
          likes: number | null
          location: unknown
          logo: string | null
          name: string | null
          offer_delivery: boolean | null
          rating: number | null
          ratings: number | null
          reviews: number | null
          slug: string | null
          status: string | null
          views: number | null
        }
        Relationships: []
      }
      threads: {
        Row: {
          last_message_at: string | null
          message_count: number | null
          partner_id: string | null
          unread_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_rider: {
        Args: { p_order_id: string; p_rider_id: string }
        Returns: undefined
      }
      category_ad_counts: {
        Args: never
        Returns: {
          ad_count: number
          name: string
          slug: string
        }[]
      }
      category_pairs_to_match: {
        Args: { p_label?: string; p_limit?: number; p_sub_label?: string }
        Returns: {
          category_hint: string
          category_label: string
          examples: string[]
          sub_category_label: string
        }[]
      }
      category_texts_to_embed: {
        Args: never
        Returns: {
          category_slug: string
          sub_category_slug: string
          text: string
        }[]
      }
      checkout_quote: {
        Args: { p_address_id?: string; p_items: Json; p_store_id: string }
        Returns: Json
      }
      count_ads_nearby: {
        Args: { lat?: number; lng?: number; radius_m?: number }
        Returns: number
      }
      dismiss_supplier_suggestion: {
        Args: { p_id: string }
        Returns: undefined
      }
      effective_price: {
        Args: {
          p_amount: number
          p_at?: string
          p_discount: number
          p_flash_amount: number
          p_flash_expires_at: string
          p_flash_starts_at: string
        }
        Returns: number
      }
      map_ads: {
        Args: {
          category?: string
          lat: number
          lng: number
          max_rows?: number
          q?: string
          radius_m?: number
          sub_category?: string
        }
        Returns: {
          category_slug: string
          created_at: string
          distance_m: number
          id: string
          image_url: string
          is_new: boolean
          lat: number
          lng: number
          price: Json
          store_id: string
          store_name: string
          store_slug: string
          sub_category_slug: string
          title: string
          total_count: number
        }[]
      }
      map_stores: {
        Args: {
          lat: number
          lng: number
          max_rows?: number
          q?: string
          radius_m?: number
        }
        Returns: {
          ad_count: number
          address: string
          category: string
          distance_m: number
          id: string
          lat: number
          lng: number
          logo: string
          name: string
          offer_delivery: boolean
          rating: number
          ratings: number
          slug: string
          total_count: number
        }[]
      }
      match_ads: {
        Args: {
          category?: string
          condition?: string
          lat?: number
          lng?: number
          match_count?: number
          max_price?: number
          min_price?: number
          min_similarity?: number
          query_embedding: string
          radius_m?: number
        }
        Returns: {
          category_slug: string
          distance_m: number
          id: string
          image_url: string
          is_new: boolean
          price: Json
          product_name: string
          similarity: number
          store_id: string
          store_name: string
          sub_category_slug: string
          title: string
        }[]
      }
      match_manual_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          access_tag: string
          content: string
          heading: string
          id: number
          similarity: number
        }[]
      }
      match_market_manual_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          heading: string
          id: number
          similarity: number
        }[]
      }
      my_ad_rating: {
        Args: { p_ad_id: string }
        Returns: {
          can_rate: boolean
          message: string
          score: number
        }[]
      }
      my_plan: { Args: never; Returns: Json }
      my_store_rating: {
        Args: { p_store_id: string }
        Returns: {
          can_rate: boolean
          message: string
          score: number
        }[]
      }
      nearby_ads: {
        Args: {
          lat?: number
          lng?: number
          max_rows?: number
          radius_m?: number
        }
        Returns: {
          category_slug: string
          created_at: string
          distance_m: number
          id: string
          image_url: string
          is_featured: boolean
          is_new: boolean
          likes: number
          price: Json
          product_id: string
          product_name: string
          quantity: number
          rating: number
          ratings: number
          reviews: number
          stock_available: number
          store_id: string
          store_logo: string
          store_name: string
          store_slug: string
          sub_category_slug: string
          title: string
          views: number
        }[]
      }
      nearby_areas: {
        Args: {
          lat?: number
          lng?: number
          max_distance_m?: number
          max_rows?: number
          q?: string
          store_radius_m?: number
        }
        Returns: {
          city: string
          distance_m: number
          id: string
          lat: number
          lng: number
          name: string
          store_count: number
        }[]
      }
      nearby_stores: {
        Args: {
          lat?: number
          lng?: number
          max_rows?: number
          radius_m?: number
        }
        Returns: {
          ad_count: number
          address: string
          category: string
          distance_m: number
          id: string
          logo: string
          name: string
          offer_delivery: boolean
          rating: number
          ratings: number
          slug: string
        }[]
      }
      nearest_categories: {
        Args: { p_count?: number; p_embedding: string; p_within?: string }
        Returns: {
          category_slug: string
          similarity: number
          sub_category_slug: string
        }[]
      }
      order_tracking: { Args: { p_order_id: string }; Returns: Json }
      place_marketplace_order: { Args: { p_order: Json }; Returns: Json }
      place_order: { Args: { p_order: Json }; Returns: string }
      public_profiles: {
        Args: { ids?: string[] }
        Returns: {
          about: string
          avatar_url: string
          created_at: string
          full_name: string
          name: string
          user_id: string
        }[]
      }
      rate_ad: {
        Args: { p_ad_id: string; p_message?: string; p_score: number }
        Returns: undefined
      }
      rate_store: {
        Args: { p_message?: string; p_score: number; p_store_id: string }
        Returns: undefined
      }
      record_category_similarity: {
        Args: {
          p_category_slug: string
          p_detail: Json
          p_label: string
          p_similarity: number
          p_sub_category_slug: string
          p_sub_label: string
        }
        Returns: number
      }
      record_order_payment: {
        Args: {
          p_amount: number
          p_method?: string
          p_order_id: string
          p_payment_id?: string
        }
        Returns: number
      }
      record_order_return: { Args: { p_returns: Json }; Returns: undefined }
      record_physical_count: { Args: { p_count: Json }; Returns: string }
      record_stock_damage: { Args: { p_damage: Json }; Returns: string }
      register_device: {
        Args: {
          p_app_version?: string
          p_device_id: string
          p_name?: string
          p_pending?: number
          p_platform: string
          p_signing_in?: boolean
        }
        Returns: Json
      }
      register_push_device: {
        Args: {
          p_app_version?: string
          p_device_id: string
          p_platform: string
          p_store_ids: string[]
          p_token: string
        }
        Returns: undefined
      }
      report_rider_location: {
        Args: {
          p_accuracy_m?: number
          p_heading?: number
          p_lat: number
          p_lng: number
          p_speed_mps?: number
        }
        Returns: undefined
      }
      resolve_batch_count: { Args: { p_line: Json }; Returns: string }
      save_category_embeddings: { Args: { p_rows: Json }; Returns: number }
      search_ads: {
        Args: {
          category?: string
          condition?: string
          lat?: number
          lng?: number
          max_price?: number
          max_rows?: number
          min_price?: number
          q?: string
          radius_m?: number
          sort?: string
          store?: string
          sub_category?: string
        }
        Returns: {
          category_slug: string
          created_at: string
          distance_m: number
          id: string
          image_url: string
          is_featured: boolean
          is_new: boolean
          price: Json
          product_id: string
          product_name: string
          store_id: string
          store_logo: string
          store_name: string
          store_slug: string
          sub_category_slug: string
          title: string
          total_count: number
        }[]
      }
      search_stores: {
        Args: {
          category?: string
          delivery?: boolean
          lat?: number
          lng?: number
          max_rows?: number
          min_rating?: number
          q?: string
          radius_m?: number
          sort?: string
        }
        Returns: {
          ad_count: number
          address: string
          category: string
          distance_m: number
          id: string
          logo: string
          name: string
          offer_delivery: boolean
          rating: number
          ratings: number
          slug: string
          total_count: number
        }[]
      }
      set_delivery_stage: {
        Args: { p_order_id: string; p_stage: string }
        Returns: undefined
      }
      set_order_client: {
        Args: { p_client_id: string; p_order_id: string }
        Returns: undefined
      }
      set_order_fulfilment: {
        Args: { p_allocations?: Json; p_order_id: string; p_target: string }
        Returns: string
      }
      set_store_published: {
        Args: { p_published: boolean; p_store_id: string }
        Returns: string
      }
      sign_out_device: {
        Args: { p_device_id: string; p_from_device_id?: string }
        Returns: Json
      }
      store_on_marketplace: { Args: { p_store_id: string }; Returns: boolean }
      sub_category_ad_counts: {
        Args: { category: string }
        Returns: {
          ad_count: number
          name: string
          slug: string
        }[]
      }
      unregister_push_device: {
        Args: { p_device_id: string }
        Returns: undefined
      }
      upsert_batch: { Args: { p_batch: Json }; Returns: string }
      use_lilli_market_message: {
        Args: { p_daily_limit: number; p_user_id: string }
        Returns: Json
      }
      use_lilli_message: { Args: { p_user_id: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
