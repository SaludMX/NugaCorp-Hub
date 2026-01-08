/**
 * TypeScript Database Types for Supabase
 * Auto-generated types matching the PostgreSQL schema
 * 
 * These types ensure type-safety when querying Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      wisps: {
        Row: {
          id: string
          name: string
          subdomain: string
          logo: string | null
          primary_color: string
          status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL'
          plan: 'BASIC' | 'PRO' | 'ENTERPRISE'
          max_clients: number
          current_clients: number
          mikrotiks_count: number
          revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subdomain: string
          logo?: string | null
          primary_color?: string
          status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL'
          plan?: 'BASIC' | 'PRO' | 'ENTERPRISE'
          max_clients?: number
          current_clients?: number
          mikrotiks_count?: number
          revenue?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string
          logo?: string | null
          primary_color?: string
          status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL'
          plan?: 'BASIC' | 'PRO' | 'ENTERPRISE'
          max_clients?: number
          current_clients?: number
          mikrotiks_count?: number
          revenue?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          wisp_id: string | null
          name: string
          email: string
          role: 'SUPER_ADMIN' | 'WISP_OWNER' | 'WISP_STAFF' | 'WISP_TECH' | 'CLIENT' | 'ADMIN' | 'SUPPORT' | 'TECH' | 'MARKETING'
          avatar: string | null
          points: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          wisp_id?: string | null
          name: string
          email: string
          role: 'SUPER_ADMIN' | 'WISP_OWNER' | 'WISP_STAFF' | 'WISP_TECH' | 'CLIENT' | 'ADMIN' | 'SUPPORT' | 'TECH' | 'MARKETING'
          avatar?: string | null
          points?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string | null
          name?: string
          email?: string
          role?: 'SUPER_ADMIN' | 'WISP_OWNER' | 'WISP_STAFF' | 'WISP_TECH' | 'CLIENT' | 'ADMIN' | 'SUPPORT' | 'TECH' | 'MARKETING'
          avatar?: string | null
          points?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          id: string
          wisp_id: string
          plan_id: string | null
          zone_id: string | null
          name: string
          email: string
          address: string
          phone: string
          avatar: string | null
          status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED'
          balance: number
          points: number
          rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
          next_rank_progress: number
          mikrotik_ip: string | null
          current_usage: number | null
          limit_usage: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          wisp_id: string
          plan_id?: string | null
          zone_id?: string | null
          name: string
          email: string
          address: string
          phone: string
          avatar?: string | null
          status?: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED'
          balance?: number
          points?: number
          rank?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
          next_rank_progress?: number
          mikrotik_ip?: string | null
          current_usage?: number | null
          limit_usage?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string
          plan_id?: string | null
          zone_id?: string | null
          name?: string
          email?: string
          address?: string
          phone?: string
          avatar?: string | null
          status?: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED'
          balance?: number
          points?: number
          rank?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
          next_rank_progress?: number
          mikrotik_ip?: string | null
          current_usage?: number | null
          limit_usage?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "network_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_zone_id_fkey"
            columns: ["zone_id"]
            referencedRelation: "zones"
            referencedColumns: ["id"]
          }
        ]
      }
      network_plans: {
        Row: {
          id: string
          wisp_id: string
          name: string
          download: number
          upload: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wisp_id: string
          name: string
          download: number
          upload: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string
          name?: string
          download?: number
          upload?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_plans_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          }
        ]
      }
      zones: {
        Row: {
          id: string
          wisp_id: string
          name: string
          ip_range: string
          latitude: number
          longitude: number
          status: 'ONLINE' | 'WARNING' | 'OFFLINE'
          clients_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wisp_id: string
          name: string
          ip_range: string
          latitude: number
          longitude: number
          status?: 'ONLINE' | 'WARNING' | 'OFFLINE'
          clients_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string
          name?: string
          ip_range?: string
          latitude?: number
          longitude?: number
          status?: 'ONLINE' | 'WARNING' | 'OFFLINE'
          clients_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          }
        ]
      }
      equipment: {
        Row: {
          id: string
          wisp_id: string
          zone_id: string | null
          client_id: string | null
          model: string
          type: 'ROUTER' | 'SWITCH' | 'SECTORIAL' | 'PTP' | 'CPE'
          mac_address: string
          ip_address: string | null
          status: 'INSTALLED' | 'STOCK' | 'FAULTY'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wisp_id: string
          zone_id?: string | null
          client_id?: string | null
          model: string
          type: 'ROUTER' | 'SWITCH' | 'SECTORIAL' | 'PTP' | 'CPE'
          mac_address: string
          ip_address?: string | null
          status?: 'INSTALLED' | 'STOCK' | 'FAULTY'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string
          zone_id?: string | null
          client_id?: string | null
          model?: string
          type?: 'ROUTER' | 'SWITCH' | 'SECTORIAL' | 'PTP' | 'CPE'
          mac_address?: string
          ip_address?: string | null
          status?: 'INSTALLED' | 'STOCK' | 'FAULTY'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_zone_id_fkey"
            columns: ["zone_id"]
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      mikrotiks: {
        Row: {
          id: string
          wisp_id: string
          zone_id: string | null
          name: string
          host: string
          port: number
          username: string
          password_encrypted: string
          model: string | null
          routeros_version: string | null
          cpu_usage: number | null
          ram_usage: number | null
          uptime: number | null
          status: 'ONLINE' | 'WARNING' | 'OFFLINE'
          last_seen: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wisp_id: string
          zone_id?: string | null
          name: string
          host: string
          port?: number
          username: string
          password_encrypted: string
          model?: string | null
          routeros_version?: string | null
          cpu_usage?: number | null
          ram_usage?: number | null
          uptime?: number | null
          status?: 'ONLINE' | 'WARNING' | 'OFFLINE'
          last_seen?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string
          zone_id?: string | null
          name?: string
          host?: string
          port?: number
          username?: string
          password_encrypted?: string
          model?: string | null
          routeros_version?: string | null
          cpu_usage?: number | null
          ram_usage?: number | null
          uptime?: number | null
          status?: 'ONLINE' | 'WARNING' | 'OFFLINE'
          last_seen?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mikrotiks_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mikrotiks_zone_id_fkey"
            columns: ["zone_id"]
            referencedRelation: "zones"
            referencedColumns: ["id"]
          }
        ]
      }
      mikrotik_jobs: {
        Row: {
          id: string
          wisp_id: string
          client_id: string | null
          action: 'CREATE' | 'UPDATE' | 'SUSPEND' | 'DELETE'
          status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED'
          payload: Json
          error_message: string | null
          retry_count: number
          max_retries: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wisp_id: string
          client_id?: string | null
          action: 'CREATE' | 'UPDATE' | 'SUSPEND' | 'DELETE'
          status?: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED'
          payload?: Json
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string
          client_id?: string | null
          action?: 'CREATE' | 'UPDATE' | 'SUSPEND' | 'DELETE'
          status?: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED'
          payload?: Json
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mikrotik_jobs_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mikrotik_jobs_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          wisp_id: string
          client_id: string
          amount: number
          due_date: string
          status: 'PAID' | 'PENDING' | 'OVERDUE'
          is_stamped: boolean | null
          cfdi_uuid: string | null
          items: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wisp_id: string
          client_id: string
          amount: number
          due_date: string
          status?: 'PAID' | 'PENDING' | 'OVERDUE'
          is_stamped?: boolean | null
          cfdi_uuid?: string | null
          items?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string
          client_id?: string
          amount?: number
          due_date?: string
          status?: 'PAID' | 'PENDING' | 'OVERDUE'
          is_stamped?: boolean | null
          cfdi_uuid?: string | null
          items?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      support_tickets: {
        Row: {
          id: string
          wisp_id: string
          client_id: string
          assigned_to: string | null
          subject: string
          description: string
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          wisp_id: string
          client_id: string
          assigned_to?: string | null
          subject: string
          description: string
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          wisp_id?: string
          client_id?: string
          assigned_to?: string | null
          subject?: string
          description?: string
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          wisp_id: string | null
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wisp_id?: string | null
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wisp_id?: string | null
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_wisp_id_fkey"
            columns: ["wisp_id"]
            referencedRelation: "wisps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_wisp_id: {
        Args: Record<PropertyKey, never>
        Returns: string | null
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'SUPER_ADMIN' | 'WISP_OWNER' | 'WISP_STAFF' | 'WISP_TECH' | 'CLIENT' | 'ADMIN' | 'SUPPORT' | 'TECH' | 'MARKETING'
      wisp_status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL'
      wisp_plan: 'BASIC' | 'PRO' | 'ENTERPRISE'
      client_status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED'
      client_rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
      equipment_type: 'ROUTER' | 'SWITCH' | 'SECTORIAL' | 'PTP' | 'CPE'
      equipment_status: 'INSTALLED' | 'STOCK' | 'FAULTY'
      zone_status: 'ONLINE' | 'WARNING' | 'OFFLINE'
      invoice_status: 'PAID' | 'PENDING' | 'OVERDUE'
      ticket_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      ticket_status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
      mikrotik_job_action: 'CREATE' | 'UPDATE' | 'SUSPEND' | 'DELETE'
      mikrotik_job_status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// =====================================================
// FASE 4A: MikroTik Jobs Types
// =====================================================

export type MikrotikJob = Database['public']['Tables']['mikrotik_jobs']['Row']
export type MikrotikJobInsert = Database['public']['Tables']['mikrotik_jobs']['Insert']
export type MikrotikJobUpdate = Database['public']['Tables']['mikrotik_jobs']['Update']
