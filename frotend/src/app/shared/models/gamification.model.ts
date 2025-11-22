/**
 * Modelo de Gamificación - Sistema de Puntos y Niveles
 */
export namespace GamificationModels {

    /**
     * Experiencia (XP) del usuario
     */
    export interface UserXP {
        user_id: string;
        total_xp: number;
        current_level: number;
        xp_in_current_level: number;
        xp_to_next_level: number;
        last_xp_gain?: {
            amount: number;
            reason: string;
            timestamp: string;
        };
    }

    /**
     * Definición de nivel
     */
    export interface Level {
        level: number;
        name: string;
        min_xp: number;
        max_xp: number;
        icon?: string;
        color?: string;
    }

    /**
     * Insignia/Badge desbloqueado
     */
    export interface Badge {
        _id: string;
        code: string; // Código único del badge
        name: string;
        description: string;
        icon: string;
        category: 'achievement' | 'milestone' | 'special';
        xp_reward?: number;
    }

    /**
     * Logro desbloqueado por usuario
     */
    export interface UserBadge {
        user_id: string;
        badge_code: string;
        unlocked_at: string;
    }

    /**
     * Acción que otorga XP
     */
    export interface XPAction {
        action: 'create_blog' | 'receive_like' | 'receive_comment' | 'blog_featured' | 'first_blog' | 'daily_login';
        xp_amount: number;
    }

    /**
     * Entrada del leaderboard
     */
    export interface LeaderboardEntry {
        user_id: string;
        username: string;
        total_xp: number;
        level: number;
        rank: number;
        badges_count: number;
    }
}
