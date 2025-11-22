import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Models } from '../models/models';
import { AuthService } from 'src/app/core/services/auth';

const USER_XP_STORAGE_KEY = 'user_xp_data';
const USER_BADGES_STORAGE_KEY = 'user_badges';

/**
 * Sistema de Gamificación con Puntos XP, Niveles y Badges
 */
@Injectable({
    providedIn: 'root'
})
export class GamificationService {

    private xpChanged = new BehaviorSubject<void>(undefined);
    public xpChanged$ = this.xpChanged.asObservable();

    // Definición de niveles
    private readonly LEVELS: Models.Gamification.Level[] = [
        { level: 1, name: 'Novato', min_xp: 0, max_xp: 49, icon: 'egg-outline', color: '#gray' },
        { level: 2, name: 'Aprendiz', min_xp: 50, max_xp: 149, icon: 'paw-outline', color: '#blue' },
        { level: 3, name: 'Intermedio', min_xp: 150, max_xp: 299, icon: 'flash-outline', color: '#purple' },
        { level: 4, name: 'Avanzado', min_xp: 300, max_xp: 499, icon: 'rocket-outline', color: '#orange' },
        { level: 5, name: 'Experto', min_xp: 500, max_xp: 799, icon: 'trophy-outline', color: '#yellow' },
        { level: 6, name: 'Maestro', min_xp: 800, max_xp: 1199, icon: 'star-outline', color: '#gold' },
        { level: 7, name: 'Leyenda', min_xp: 1200, max_xp: 1799, icon: 'diamond-outline', color: '#cyan' },
        { level: 8, name: 'Titán', min_xp: 1800, max_xp: 2599, icon: 'shield-outline', color: '#red' },
        { level: 9, name: 'Inmortal', min_xp: 2600, max_xp: 3999, icon: 'flame-outline', color: '#crimson' },
        { level: 10, name: 'Divino', min_xp: 4000, max_xp: 999999, icon: 'infinite-outline', color: '#rainbow' }
    ];

    // Definición de badges disponibles
    private readonly AVAILABLE_BADGES: Models.Gamification.Badge[] = [
        {
            _id: 'badge_first_blog',
            code: 'first_blog',
            name: 'Primera Publicación',
            description: 'Creaste tu primer blog',
            icon: 'document-text',
            category: 'milestone',
            xp_reward: 10
        },
        {
            _id: 'badge_100_likes',
            code: '100_likes',
            name: 'Popular',
            description: 'Acumula 100 likes en total',
            icon: 'heart',
            category: 'achievement',
            xp_reward: 50
        },
        {
            _id: 'badge_10_blogs',
            code: '10_blogs',
            name: 'Prolífico',
            description: 'Publica 10 blogs',
            icon: 'albums',
            category: 'milestone',
            xp_reward: 30
        },
        {
            _id: 'badge_level_5',
            code: 'level_5',
            name: 'Experto Confirmado',
            description: 'Alcanza el nivel 5',
            icon: 'medal',
            category: 'milestone',
            xp_reward: 25
        },
        {
            _id: 'badge_featured',
            code: 'first_featured',
            name: 'Destacado',
            description: 'Tu blog fue destacado por primera vez',
            icon: 'star',
            category: 'achievement',
            xp_reward: 20
        }
    ];

    // Acciones que otorgan XP
    private readonly XP_ACTIONS: Record<string, number> = {
        'create_blog': 10,
        'receive_like': 5,
        'receive_comment': 3,
        'blog_featured': 15,
        'first_blog': 10,
        'daily_login': 5
    };

    private userXPMap: Map<string, Models.Gamification.UserXP> = new Map();
    private userBadgesMap: Map<string, Models.Gamification.UserBadge[]> = new Map();

    constructor(private authService: AuthService) {
        this.loadFromStorage();
    }

    /**
     * Carga datos desde localStorage
     */
    private loadFromStorage(): void {
        const xpData = localStorage.getItem(USER_XP_STORAGE_KEY);
        const badgesData = localStorage.getItem(USER_BADGES_STORAGE_KEY);

        if (xpData) {
            const parsed = JSON.parse(xpData);
            this.userXPMap = new Map(Object.entries(parsed));
        }

        if (badgesData) {
            const parsed = JSON.parse(badgesData);
            Object.entries(parsed).forEach(([userId, badges]) => {
                this.userBadgesMap.set(userId, badges as Models.Gamification.UserBadge[]);
            });
        }
    }

    /**
     * Guarda datos en localStorage
     */
    private saveToStorage(): void {
        const xpObj = Object.fromEntries(this.userXPMap);
        const badgesObj = Object.fromEntries(this.userBadgesMap);

        localStorage.setItem(USER_XP_STORAGE_KEY, JSON.stringify(xpObj));
        localStorage.setItem(USER_BADGES_STORAGE_KEY, JSON.stringify(badgesObj));
        this.xpChanged.next();
    }

    /**
     * Añade XP a un usuario
     */
    addXP(userId: string, action: string, customAmount?: number): Observable<Models.Gamification.UserXP> {
        const xpAmount = customAmount || this.XP_ACTIONS[action] || 0;

        let userXP = this.userXPMap.get(userId);

        if (!userXP) {
            // Crear datos iniciales
            userXP = {
                user_id: userId,
                total_xp: 0,
                current_level: 1,
                xp_in_current_level: 0,
                xp_to_next_level: 50
            };
        }

        // Añadir XP
        userXP.total_xp += xpAmount;
        userXP.xp_in_current_level += xpAmount;

        // Actualizar último gain
        userXP.last_xp_gain = {
            amount: xpAmount,
            reason: action,
            timestamp: new Date().toISOString()
        };

        // Verificar si subió de nivel
        this.checkLevelUp(userXP);

        this.userXPMap.set(userId, userXP);
        this.saveToStorage();

        console.log(`+${xpAmount} XP por ${action} (Total: ${userXP.total_xp})`);

        return of(userXP).pipe(delay(100));
    }

    /**
     * Verifica y actualiza nivel si corresponde
     */
    private checkLevelUp(userXP: Models.Gamification.UserXP): boolean {
        const currentLevelData = this.LEVELS.find(l => l.level === userXP.current_level);
        if (!currentLevelData) return false;

        // Si el XP total supera el máximo del nivel actual
        if (userXP.total_xp > currentLevelData.max_xp) {
            const nextLevel = this.LEVELS.find(l => l.level === userXP.current_level + 1);
            if (nextLevel) {
                userXP.current_level = nextLevel.level;
                userXP.xp_in_current_level = userXP.total_xp - nextLevel.min_xp;
                userXP.xp_to_next_level = nextLevel.max_xp - userXP.total_xp;
                console.log(`🎉 ¡Subiste al nivel ${nextLevel.level}: ${nextLevel.name}!`);
                return true;
            }
        } else {
            // Actualizar XP para siguiente nivel
            userXP.xp_to_next_level = currentLevelData.max_xp - userXP.total_xp + 1;
        }

        return false;
    }

    /**
     * Obtiene los datos de XP de un usuario
     */
    getUserXP(userId: string): Observable<Models.Gamification.UserXP> {
        let userXP = this.userXPMap.get(userId);

        if (!userXP) {
            userXP = {
                user_id: userId,
                total_xp: 0,
                current_level: 1,
                xp_in_current_level: 0,
                xp_to_next_level: 50
            };
            this.userXPMap.set(userId, userXP);
            this.saveToStorage();
        }

        return of(userXP);
    }

    /**
     * Obtiene la información de un nivel
     */
    getUserLevel(userId: string): Observable<Models.Gamification.Level> {
        const userXP = this.userXPMap.get(userId);
        const levelNumber = userXP?.current_level || 1;
        const level = this.LEVELS.find(l => l.level === levelNumber) || this.LEVELS[0];

        return of(level);
    }

    /**
     * Desbloquea un badge para un usuario
     */
    unlockBadge(userId: string, badgeCode: string): Observable<Models.Gamification.Badge | null> {
        const badge = this.AVAILABLE_BADGES.find(b => b.code === badgeCode);
        if (!badge) return of(null);

        let userBadges = this.userBadgesMap.get(userId) || [];

        // Verificar si ya lo tiene
        if (userBadges.some(ub => ub.badge_code === badgeCode)) {
            return of(null);
        }

        // Añadir badge
        const newUserBadge: Models.Gamification.UserBadge = {
            user_id: userId,
            badge_code: badgeCode,
            unlocked_at: new Date().toISOString()
        };

        userBadges.push(newUserBadge);
        this.userBadgesMap.set(userId, userBadges);

        // Dar XP de recompensa si tiene
        if (badge.xp_reward) {
            this.addXP(userId, `badge_${badgeCode}`, badge.xp_reward).subscribe();
        }

        this.saveToStorage();
        console.log(`🏆 ¡Badge desbloqueado: ${badge.name}!`);

        return of(badge).pipe(delay(100));
    }

    /**
     * Obtiene los badges de un usuario
     */
    getUserBadges(userId: string): Observable<Models.Gamification.Badge[]> {
        const userBadges = this.userBadgesMap.get(userId) || [];
        const badges = userBadges.map(ub =>
            this.AVAILABLE_BADGES.find(b => b.code === ub.badge_code)
        ).filter(b => b !== undefined) as Models.Gamification.Badge[];

        return of(badges);
    }

    /**
     * Obtiene el leaderboard (top usuarios por XP)
     */
    getLeaderboard(limit: number = 10): Observable<Models.Gamification.LeaderboardEntry[]> {
        const entries: Models.Gamification.LeaderboardEntry[] = [];

        this.userXPMap.forEach((xp, userId) => {
            const badgesCount = (this.userBadgesMap.get(userId) || []).length;

            entries.push({
                user_id: userId,
                username: `User_${userId.slice(0, 6)}`, // En producción vendría del UserService
                total_xp: xp.total_xp,
                level: xp.current_level,
                rank: 0, // Se calculará después
                badges_count: badgesCount
            });
        });

        // Ordenar por XP descendente
        entries.sort((a, b) => b.total_xp - a.total_xp);

        // Asignar ranks
        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        return of(entries.slice(0, limit));
    }

    /**
     * Obtiene todos los niveles disponibles
     */
    getAllLevels(): Observable<Models.Gamification.Level[]> {
        return of(this.LEVELS);
    }

    /**
     * Obtiene todos los badges disponibles
     */
    getAllBadges(): Observable<Models.Gamification.Badge[]> {
        return of(this.AVAILABLE_BADGES);
    }
}
