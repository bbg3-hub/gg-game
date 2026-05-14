import { ActiveMonster, Player, SpaceshipGameSession } from './spaceshipGameSession';
import { MonsterType, BASE_MONSTER_STATS, calculateMonsterStats, TIER_MULTIPLIERS, BOSS_CONFIGURATIONS } from './monsterConfig';

export interface MonsterAIState {
  target: Player | null;
  state: 'IDLE' | 'CHASING' | 'ATTACKING' | 'STUNNED' | 'DEAD';
  lastStateChange: number;
  cooldown: number;
  specialCooldown: number;
  pathTarget: { x: number; y: number };
  velocity: { x: number; y: number };
}

export interface BossPhase {
  phase: number;
  healthThreshold: number;
  name: string;
  abilities: string[];
  duration: number;
}

export class MonsterAI {
  private state: MonsterAIState;
  private monster: ActiveMonster;
  private session: SpaceshipGameSession;

  constructor(monster: ActiveMonster, session: SpaceshipGameSession) {
    this.monster = monster;
    this.session = session;
    this.state = {
      target: null,
      state: 'IDLE',
      lastStateChange: Date.now(),
      cooldown: 0,
      specialCooldown: 0,
      pathTarget: { x: monster.position.x, y: monster.position.y },
      velocity: { x: 0, y: 0 }
    };
  }

  update(deltaTime: number): void {
    // Update cooldowns
    this.state.cooldown = Math.max(0, this.state.cooldown - deltaTime);
    this.state.specialCooldown = Math.max(0, this.state.specialCooldown - deltaTime);

    // Check if monster is dead
    if (this.monster.health <= 0) {
      this.state.state = 'DEAD';
      return;
    }

    // Update boss phases
    if (this.monster.isBoss) {
      this.updateBossPhase();
    }

    // Update effects
    this.updateEffects(deltaTime);

    // Find target if needed
    if (!this.state.target || this.state.target.status !== 'alive') {
      this.findTarget();
    }

    // Execute AI behavior based on monster type and tier
    switch (this.monster.type) {
      case 'CRAWLER':
        this.updateCrawlerAI(deltaTime);
        break;
      case 'CHARGER':
        this.updateChargerAI(deltaTime);
        break;
      case 'SPITTER':
        this.updateSpitterAI(deltaTime);
        break;
      case 'OOZE_BLOB':
        this.updateOozeAI(deltaTime);
        break;
      case 'ARMORED_KNIGHT':
        this.updateKnightAI(deltaTime);
        break;
      case 'MUTANT_ABOMINATION':
        this.updateAbominationAI(deltaTime);
        break;
      case 'VOID_ENTITY':
        this.updateVoidAI(deltaTime);
        break;
    }

    // Update position based on velocity
    this.updatePosition(deltaTime);
  }

  private findTarget(): void {
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    if (alivePlayers.length === 0) {
      this.state.target = null;
      return;
    }

    // Find closest player
    let closestPlayer: Player | null = null;
    let closestDistance = Infinity;

    for (const player of alivePlayers) {
      const distance = this.getDistanceToPlayer(player);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlayer = player;
      }
    }

    this.state.target = closestPlayer;
  }

  private getDistanceToPlayer(player: Player): number {
    return Math.sqrt(
      Math.pow(this.monster.position.x - player.position.x, 2) +
      Math.pow(this.monster.position.y - player.position.y, 2)
    );
  }

  private updateCrawlerAI(deltaTime: number): void {
    const stats = BASE_MONSTER_STATS.CRAWLER;
    
    if (this.state.target) {
      const distance = this.getDistanceToPlayer(this.state.target);
      
      if (distance <= stats.detectionRange) {
        this.state.state = 'CHASING';
        
        // Move towards target
        const dx = this.state.target.position.x - this.monster.position.x;
        const dy = this.state.target.position.y - this.monster.position.y;
        const distanceNormalized = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceNormalized > 0) {
          this.state.velocity.x = (dx / distanceNormalized) * stats.speed;
          this.state.velocity.y = (dy / distanceNormalized) * stats.speed;
        }

        // Attack if in range
        if (distance <= stats.attackRange && this.state.cooldown <= 0) {
          this.performCrawlerAttack();
          this.state.cooldown = stats.attackCooldown;
        }
      } else {
        this.state.state = 'IDLE';
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      // Tier-specific abilities
      this.handleCrawlerTierAbilities();
    }
  }

  private handleCrawlerTierAbilities(): void {
    switch (this.monster.tier) {
      case 2:
        // Faster movement, tentacle swipe
        if (this.state.cooldown <= 0 && this.state.target) {
          // Tentacle swipe ability
          this.state.cooldown = 4000; // 4 second cooldown
        }
        break;
      case 3:
        // Acid spit, spawns minions on death
        if (this.state.cooldown <= 0 && this.state.target) {
          // Acid spit projectile
          this.state.cooldown = 3000; // 3 second cooldown
        }
        break;
      case 4:
        // Multiple acid attacks, armor plating
        if (this.state.cooldown <= 0 && this.state.target) {
          // Multiple acid attacks
          this.state.cooldown = 2500; // 2.5 second cooldown
        }
        break;
      case 5:
        // Boss abilities - Crawler Alpha
        this.handleCrawlerAlphaAbilities();
        break;
    }
  }

  private handleCrawlerAlphaAbilities(): void {
    // Spreads poison pools, summons crawlers, continuous DOT
    if (this.state.specialCooldown <= 0) {
      // Summon additional crawlers
      this.summonMinions();
      this.state.specialCooldown = 8000; // 8 second cooldown
    }
  }

  private performCrawlerAttack(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.CRAWLER.damage;
      this.state.target.health -= damage;
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private updateChargerAI(deltaTime: number): void {
    const stats = BASE_MONSTER_STATS.CHARGER;
    
    if (this.state.target) {
      const distance = this.getDistanceToPlayer(this.state.target);
      
      if (distance <= stats.detectionRange) {
        this.state.state = 'CHASING';
        
        // Charge behavior - faster but less agile
        const dx = this.state.target.position.x - this.monster.position.x;
        const dy = this.state.target.position.y - this.monster.position.y;
        const distanceNormalized = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceNormalized > 0) {
          const chargeSpeed = stats.speed * 1.5; // Faster when charging
          this.state.velocity.x = (dx / distanceNormalized) * chargeSpeed;
          this.state.velocity.y = (dy / distanceNormalized) * chargeSpeed;
        }

        // Charge attack if in range
        if (distance <= stats.attackRange && this.state.cooldown <= 0) {
          this.performChargerAttack();
          this.state.cooldown = stats.attackCooldown;
        }
      } else {
        this.state.state = 'IDLE';
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      this.handleChargerTierAbilities();
    }
  }

  private handleChargerTierAbilities(): void {
    switch (this.monster.tier) {
      case 2:
        // Dual charges, shockwave impact
        if (this.state.cooldown <= 0 && this.state.target) {
          this.state.cooldown = 4000; // Dual charge cooldown
        }
        break;
      case 3:
        // AOE ground slam, piercing charge
        if (this.state.cooldown <= 0 && this.state.target) {
          this.performAOESlam();
          this.state.cooldown = 5000; // AOE attack cooldown
        }
        break;
      case 4:
        // 3x rapid charge combo, electrical trails
        if (this.state.cooldown <= 0 && this.state.target) {
          this.performRapidCharges();
          this.state.cooldown = 6000; // Combo cooldown
        }
        break;
      case 5:
        // Boss abilities - Charger Warlord
        this.handleChargerWarlordAbilities();
        break;
    }
  }

  private handleChargerWarlordAbilities(): void {
    // 3 phases: melee → dual projectiles → rampage mode
    if (this.state.specialCooldown <= 0) {
      const phase = this.monster.bossPhase || 1;
      
      switch (phase) {
        case 1:
          // Melee phase - enhanced charge attacks
          this.performWarlordCharge();
          break;
        case 2:
          // Dual projectile phase
          this.fireDualProjectiles();
          break;
        case 3:
          // Rampage mode - rapid charges
          this.performRampage();
          break;
      }
      
      this.state.specialCooldown = 3000; // 3 second cooldown between abilities
    }
  }

  private performChargerAttack(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.CHARGER.damage;
      this.state.target.health -= damage;
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private performAOESlam(): void {
    // Damage all players in radius
    const slamRadius = 80;
    const damage = BASE_MONSTER_STATS.CHARGER.damage * 1.5;
    
    this.session.players.forEach(player => {
      if (player.status === 'alive') {
        const distance = Math.sqrt(
          Math.pow(player.position.x - this.monster.position.x, 2) +
          Math.pow(player.position.y - this.monster.position.y, 2)
        );
        
        if (distance <= slamRadius) {
          player.health -= damage;
          if (player.health <= 0) {
            player.status = 'dead';
          }
        }
      }
    });
  }

  private performRapidCharges(): void {
    // Multiple rapid charges in sequence
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.CHARGER.damage * 0.7; // Reduced damage per charge
      
      // Perform 3 rapid charges
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          if (this.state.target && this.state.target.status === 'alive') {
            this.state.target.health -= damage;
            if (this.state.target.health <= 0) {
              this.state.target.status = 'dead';
            }
          }
        }, i * 300); // 300ms between charges
      }
    }
  }

  private performWarlordCharge(): void {
    // Enhanced charge with knockback
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.CHARGER.damage * 2;
      this.state.target.health -= damage;
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
      
      // Add knockback effect (would be handled in client)
      this.state.cooldown = 4000;
    }
  }

  private fireDualProjectiles(): void {
    // Fire two projectiles at targets
    const targets = this.session.players.filter(p => p.status === 'alive');
    if (targets.length >= 2) {
      const damage = BASE_MONSTER_STATS.CHARGER.damage * 1.2;
      
      targets.slice(0, 2).forEach(target => {
        target.health -= damage;
        if (target.health <= 0) {
          target.status = 'dead';
        }
      });
    }
  }

  private performRampage(): void {
    // Rapid charges on all alive players
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    const damage = BASE_MONSTER_STATS.CHARGER.damage * 0.8;
    
    alivePlayers.forEach(player => {
      player.health -= damage;
      if (player.health <= 0) {
        player.status = 'dead';
      }
    });
  }

  private updateSpitterAI(deltaTime: number): void {
    const stats = BASE_MONSTER_STATS.SPITTER;
    
    if (this.state.target) {
      const distance = this.getDistanceToPlayer(this.state.target);
      
      if (distance <= stats.detectionRange) {
        this.state.state = 'CHASING';
        
        // Float movement - stay at medium distance
        const optimalDistance = 120;
        const dx = this.state.target.position.x - this.monster.position.x;
        const dy = this.state.target.position.y - this.monster.position.y;
        const distanceNormalized = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceNormalized > 0) {
          // Move away if too close, move closer if too far
          let speed = stats.speed;
          if (distanceNormalized < optimalDistance) {
            speed = -speed * 0.7; // Move away
          } else if (distanceNormalized > optimalDistance + 20) {
            speed = speed * 0.5; // Move closer slowly
          }
          
          this.state.velocity.x = (dx / distanceNormalized) * speed;
          this.state.velocity.y = (dy / distanceNormalized) * speed;
        }

        // Ranged attack
        if (this.state.cooldown <= 0) {
          this.performSpitterAttack();
          this.state.cooldown = stats.attackCooldown;
        }
      } else {
        this.state.state = 'IDLE';
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      this.handleSpitterTierAbilities();
    }
  }

  private handleSpitterTierAbilities(): void {
    switch (this.monster.tier) {
      case 2:
        // Medium speed, 2 shots
        if (this.state.cooldown <= 0 && this.state.target) {
          this.state.cooldown = 2000; // Dual shot cooldown
        }
        break;
      case 3:
        // Fast projectiles, 3-shot spread, poison
        if (this.state.cooldown <= 0 && this.state.target) {
          this.fireSpreadShot();
          this.state.cooldown = 2500; // Spread shot cooldown
        }
        break;
      case 4:
        // Rapid fire, 5 shots, bouncing, heals allies
        if (this.state.cooldown <= 0 && this.state.target) {
          this.fireRapidShots();
          this.state.cooldown = 3000; // Rapid fire cooldown
        }
        break;
      case 5:
        // Boss abilities - Spitter Hive Queen
        this.handleSpitterQueenAbilities();
        break;
    }
  }

  private handleSpitterQueenAbilities(): void {
    // Spawns drone spitters, 12-projectile swarm, poison cloud AOE, teleports
    if (this.state.specialCooldown <= 0) {
      const phase = this.monster.bossPhase || 1;
      
      switch (phase) {
        case 1:
          // Spawn drone spitters
          this.spawnDroneSpitters();
          break;
        case 2:
          // 12-projectile swarm
          this.fireSwarmAttack();
          break;
      }
      
      this.state.specialCooldown = 5000; // 5 second cooldown
    }
  }

  private performSpitterAttack(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.SPITTER.damage;
      
      // Create projectile effect (would be handled in client)
      this.state.target.health -= damage;
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private fireSpreadShot(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.SPITTER.damage * 0.8;
      const shots = 3;
      
      for (let i = 0; i < shots; i++) {
        setTimeout(() => {
          if (this.state.target && this.state.target.status === 'alive') {
            this.state.target.health -= damage;
            if (this.state.target.health <= 0) {
              this.state.target.status = 'dead';
            }
          }
        }, i * 200); // Spread shots over time
      }
    }
  }

  private fireRapidShots(): void {
    const targets = this.session.players.filter(p => p.status === 'alive');
    if (targets.length === 0) return;
    
    const damage = BASE_MONSTER_STATS.SPITTER.damage * 0.6;
    const shots = 5;
    
    for (let i = 0; i < shots; i++) {
      setTimeout(() => {
        const target = targets[Math.floor(Math.random() * targets.length)];
        if (target && target.status === 'alive') {
          target.health -= damage;
          if (target.health <= 0) {
            target.status = 'dead';
          }
        }
      }, i * 100); // Rapid fire
    }
  }

  private spawnDroneSpitters(): void {
    // Spawn 2-3 small drone spitters
    for (let i = 0; i < 3; i++) {
      const drone: ActiveMonster = {
        id: `drone-${Date.now()}-${i}`,
        type: 'SPITTER',
        tier: 1,
        health: 20,
        maxHealth: 20,
        position: {
          x: this.monster.position.x + (Math.random() - 0.5) * 100,
          y: this.monster.position.y + (Math.random() - 0.5) * 100
        },
        velocity: { x: 0, y: 0 },
        attackCooldown: 2000,
        specialAbilities: [],
        isBoss: false,
        lastAttack: 0,
        effects: { stunned: false, slow: false, regenerating: false }
      };
      
      this.session.monsters.push(drone);
    }
  }

  private fireSwarmAttack(): void {
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    const damage = BASE_MONSTER_STATS.SPITTER.damage * 0.4;
    
    // Fire 12 projectiles total
    alivePlayers.forEach(player => {
      for (let i = 0; i < 4; i++) { // 4 shots per player
        setTimeout(() => {
          if (player.status === 'alive') {
            player.health -= damage;
            if (player.health <= 0) {
              player.status = 'dead';
            }
          }
        }, i * 150); // Staggered shots
      }
    });
  }

  private updateOozeAI(deltaTime: number): void {
    // Gelatinous movement and engulfing behavior
    const stats = BASE_MONSTER_STATS.OOZE_BLOB;
    
    if (this.state.target) {
      const distance = this.getDistanceToPlayer(this.state.target);
      
      if (distance <= stats.detectionRange) {
        this.state.state = 'CHASING';
        
        // Slow but steady pursuit
        const dx = this.state.target.position.x - this.monster.position.x;
        const dy = this.state.target.position.y - this.monster.position.y;
        const distanceNormalized = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceNormalized > 0) {
          this.state.velocity.x = (dx / distanceNormalized) * stats.speed;
          this.state.velocity.y = (dy / distanceNormalized) * stats.speed;
        }

        // Engulf attack
        if (distance <= stats.attackRange && this.state.cooldown <= 0) {
          this.performOozeEngulf();
          this.state.cooldown = stats.attackCooldown;
        }
      } else {
        this.state.state = 'IDLE';
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      this.handleOozeTierAbilities();
    }
  }

  private handleOozeTierAbilities(): void {
    switch (this.monster.tier) {
      case 3:
        // 100 HP, engulfs players (stun), splits into 2 on death
        if (this.state.cooldown <= 0 && this.state.target) {
          this.performEngulfStun();
          this.state.cooldown = 4000; // Engulf cooldown
        }
        break;
      case 4:
        // 200 HP, corrosive touch (DOT), splits into 4
        if (this.state.cooldown <= 0 && this.state.target) {
          this.performCorrosiveTouch();
          this.state.cooldown = 3000; // Corrosive touch cooldown
        }
        break;
      case 5:
        // Boss abilities - Ooze Amalgamation
        this.handleOozeAmalgamationAbilities();
        break;
    }
  }

  private handleOozeAmalgamationAbilities(): void {
    // Absorbs monsters to grow, regenerates, multi-phase
    if (this.state.specialCooldown <= 0) {
      this.performMonsterAbsorption();
      this.state.specialCooldown = 10000; // 10 second cooldown
    }
  }

  private performOozeEngulf(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.OOZE_BLOB.damage;
      this.state.target.health -= damage;
      
      // Stun effect (would be handled in client)
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private performEngulfStun(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.OOZE_BLOB.damage;
      this.state.target.health -= damage;
      
      // Stun effect (would be handled in client)
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private performCorrosiveTouch(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.OOZE_BLOB.damage;
      this.state.target.health -= damage;
      
      // DOT effect (would be handled in client)
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private performMonsterAbsorption(): void {
    // Absorb nearby monsters to heal
    const absorbRadius = 100;
    let healAmount = 0;
    
    this.session.monsters.forEach((monster, index) => {
      if (monster.id !== this.monster.id && monster.health > 0) {
        const distance = Math.sqrt(
          Math.pow(monster.position.x - this.monster.position.x, 2) +
          Math.pow(monster.position.y - this.monster.position.y, 2)
        );
        
        if (distance <= absorbRadius) {
          healAmount += monster.health;
          monster.health = 0; // Remove absorbed monster
        }
      }
    });
    
    if (healAmount > 0) {
      this.monster.health = Math.min(this.monster.maxHealth, this.monster.health + healAmount);
    }
  }

  private updateKnightAI(deltaTime: number): void {
    const stats = BASE_MONSTER_STATS.ARMORED_KNIGHT;
    
    if (this.state.target) {
      const distance = this.getDistanceToPlayer(this.state.target);
      
      if (distance <= stats.detectionRange) {
        this.state.state = 'CHASING';
        
        // Slow but persistent pursuit
        const dx = this.state.target.position.x - this.monster.position.x;
        const dy = this.state.target.position.y - this.monster.position.y;
        const distanceNormalized = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceNormalized > 0) {
          this.state.velocity.x = (dx / distanceNormalized) * stats.speed;
          this.state.velocity.y = (dy / distanceNormalized) * stats.speed;
        }

        // Shield bash attack
        if (distance <= stats.attackRange && this.state.cooldown <= 0) {
          this.performKnightBash();
          this.state.cooldown = stats.attackCooldown;
        }
      } else {
        this.state.state = 'IDLE';
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      this.handleKnightTierAbilities();
    }
  }

  private handleKnightTierAbilities(): void {
    switch (this.monster.tier) {
      case 3:
        // 150 HP, shield blocks 50% front damage
        // Shield logic would be handled in damage calculation
        break;
      case 4:
        // 280 HP, shield bash knockback, calls reinforcements
        if (this.state.cooldown <= 0 && this.state.target) {
          this.performShieldBash();
          this.callReinforcements();
          this.state.cooldown = 5000; // Special ability cooldown
        }
        break;
      case 5:
        // Boss abilities - Iron Guardian
        this.handleIronGuardianAbilities();
        break;
    }
  }

  private handleIronGuardianAbilities(): void {
    // 3 phases: shield defense → aggressive → desperate fast attacks
    if (this.state.specialCooldown <= 0) {
      const phase = this.monster.bossPhase || 1;
      
      switch (phase) {
        case 1:
          // Shield defense mode
          this.activateShieldDefense();
          break;
        case 2:
          // Aggressive assault mode
          this.activateAggressiveMode();
          break;
        case 3:
          // Desperate fast attacks
          this.activateDesperateFrenzy();
          break;
      }
      
      this.state.specialCooldown = 4000; // 4 second cooldown
    }
  }

  private performKnightBash(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.ARMORED_KNIGHT.damage;
      this.state.target.health -= damage;
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private performShieldBash(): void {
    if (this.state.target && this.state.target.status === 'alive') {
      const damage = BASE_MONSTER_STATS.ARMORED_KNIGHT.damage * 1.5;
      this.state.target.health -= damage;
      
      // Knockback effect (would be handled in client)
      
      if (this.state.target.health <= 0) {
        this.state.target.status = 'dead';
      }
    }
  }

  private callReinforcements(): void {
    // Call 2-3 additional armored knights
    for (let i = 0; i < 2; i++) {
      const reinforcement: ActiveMonster = {
        id: `knight-${Date.now()}-${i}`,
        type: 'ARMORED_KNIGHT',
        tier: 2,
        health: 100,
        maxHealth: 100,
        position: {
          x: this.monster.position.x + (Math.random() - 0.5) * 200,
          y: this.monster.position.y + (Math.random() - 0.5) * 200
        },
        velocity: { x: 0, y: 0 },
        attackCooldown: 2800,
        specialAbilities: [],
        isBoss: false,
        lastAttack: 0,
        effects: { stunned: false, slow: false, regenerating: false }
      };
      
      this.session.monsters.push(reinforcement);
    }
  }

  private activateShieldDefense(): void {
    // Increase defense, reduce damage taken
    // Would be handled in damage calculation
  }

  private activateAggressiveMode(): void {
    // Increase speed and aggression
    // Would modify movement behavior
  }

  private activateDesperateFrenzy(): void {
    // Rapid attacks on all players
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    const damage = BASE_MONSTER_STATS.ARMORED_KNIGHT.damage * 0.8;
    
    alivePlayers.forEach(player => {
      player.health -= damage;
      if (player.health <= 0) {
        player.status = 'dead';
      }
    });
  }

  private updateAbominationAI(deltaTime: number): void {
    const stats = BASE_MONSTER_STATS.MUTANT_ABOMINATION;
    
    if (this.state.target) {
      const distance = this.getDistanceToPlayer(this.state.target);
      
      if (distance <= stats.detectionRange) {
        this.state.state = 'CHASING';
        
        // Chaotic movement
        const dx = this.state.target.position.x - this.monster.position.x;
        const dy = this.state.target.position.y - this.monster.position.y;
        const distanceNormalized = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceNormalized > 0) {
          this.state.velocity.x = (dx / distanceNormalized) * stats.speed;
          this.state.velocity.y = (dy / distanceNormalized) * stats.speed;
        }

        // Multi-limb attack
        if (this.state.cooldown <= 0) {
          this.performAbominationAttack();
          this.state.cooldown = stats.attackCooldown;
        }
      } else {
        this.state.state = 'IDLE';
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      this.handleAbominationTierAbilities();
    }
  }

  private handleAbominationTierAbilities(): void {
    switch (this.monster.tier) {
      case 4:
        // 300 HP, regenerates +10%/sec, 6 limb attacks
        if (this.monster.health < this.monster.maxHealth) {
          const regenAmount = this.monster.maxHealth * 0.1 * 0.1; // 10% per second
          this.monster.health = Math.min(this.monster.maxHealth, this.monster.health + regenAmount);
        }
        break;
      case 5:
        // Boss abilities - Elder Abomination
        this.handleElderAbominationAbilities();
        break;
    }
  }

  private handleElderAbominationAbilities(): void {
    // Multi-body parts with separate health bars, accelerating regeneration, splits/reattaches limbs
    if (this.state.specialCooldown <= 0) {
      this.performAbominationRegeneration();
      this.state.specialCooldown = 6000; // 6 second cooldown
    }
  }

  private performAbominationAttack(): void {
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    const damage = BASE_MONSTER_STATS.MUTANT_ABOMINATION.damage * 0.6; // Distributed damage
    
    alivePlayers.forEach(player => {
      player.health -= damage;
      if (player.health <= 0) {
        player.status = 'dead';
      }
    });
  }

  private performAbominationRegeneration(): void {
    // Accelerated regeneration
    const regenAmount = this.monster.maxHealth * 0.2; // 20% heal
    this.monster.health = Math.min(this.monster.maxHealth, this.monster.health + regenAmount);
  }

  private updateVoidAI(deltaTime: number): void {
    const stats = BASE_MONSTER_STATS.VOID_ENTITY;
    
    if (this.state.target) {
      const distance = this.getDistanceToPlayer(this.state.target);
      
      if (distance <= stats.detectionRange) {
        this.state.state = 'CHASING';
        
        // Teleport movement
        if (this.state.cooldown <= 0) {
          this.performTeleport();
          this.state.cooldown = 3000; // Teleport cooldown
        }

        // Reality-bending attack
        if (this.state.cooldown <= 0) {
          this.performRealityWarp();
          this.state.cooldown = 4000; // Reality warp cooldown
        }
      } else {
        this.state.state = 'IDLE';
        this.state.velocity.x = 0;
        this.state.velocity.y = 0;
      }

      this.handleVoidEntityAbilities();
    }
  }

  private handleVoidEntityAbilities(): void {
    // Phase-shifting (invulnerable), reality-bending projectiles, shadow clones, rift zones
    if (this.state.specialCooldown <= 0) {
      const phase = this.monster.bossPhase || 1;
      
      switch (phase) {
        case 1:
          // Reality bending projectiles
          this.fireRealityProjectiles();
          break;
        case 2:
          // Shadow clones
          this.spawnShadowClones();
          break;
        case 3:
          // Rift zones
          this.createRiftZones();
          break;
        case 4:
          // Phase shifting
          this.activatePhaseShift();
          break;
        case 5:
          // Cosmic horror mode
          this.activateCosmicHorror();
          break;
      }
      
      this.state.specialCooldown = 5000; // 5 second cooldown
    }
  }

  private performTeleport(): void {
    // Teleport to random position near target
    if (this.state.target) {
      const newX = this.state.target.position.x + (Math.random() - 0.5) * 150;
      const newY = this.state.target.position.y + (Math.random() - 0.5) * 150;
      
      this.monster.position.x = Math.max(50, Math.min(850, newX));
      this.monster.position.y = Math.max(50, Math.min(650, newY));
    }
  }

  private performRealityWarp(): void {
    // Reality-bending projectiles that ignore normal physics
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    const damage = BASE_MONSTER_STATS.VOID_ENTITY.damage * 1.5;
    
    alivePlayers.forEach(player => {
      player.health -= damage;
      if (player.health <= 0) {
        player.status = 'dead';
      }
    });
  }

  private fireRealityProjectiles(): void {
    // Fire projectiles that curve and follow targets
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    const damage = BASE_MONSTER_STATS.VOID_ENTITY.damage;
    
    alivePlayers.forEach(player => {
      setTimeout(() => {
        if (player.status === 'alive') {
          player.health -= damage;
          if (player.health <= 0) {
            player.status = 'dead';
          }
        }
      }, Math.random() * 2000); // Staggered attacks
    });
  }

  private spawnShadowClones(): void {
    // Spawn shadow clones that mimic the void entity
    for (let i = 0; i < 3; i++) {
      const clone: ActiveMonster = {
        id: `shadow-${Date.now()}-${i}`,
        type: 'VOID_ENTITY',
        tier: 3,
        health: 100,
        maxHealth: 100,
        position: {
          x: this.monster.position.x + (Math.random() - 0.5) * 200,
          y: this.monster.position.y + (Math.random() - 0.5) * 200
        },
        velocity: { x: 0, y: 0 },
        attackCooldown: 2000,
        specialAbilities: [],
        isBoss: false,
        lastAttack: 0,
        effects: { stunned: false, slow: false, regenerating: false }
      };
      
      this.session.monsters.push(clone);
    }
  }

  private createRiftZones(): void {
    // Create damaging zones that persist
    const riftPositions = [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
      { x: 400, y: 400 }
    ];
    
    riftPositions.forEach(pos => {
      // Damage players in rift zones (would be handled in client with persistent effects)
    });
  }

  private activatePhaseShift(): void {
    // Become invulnerable for a period
    // Would be handled in client with phase shift effect
  }

  private activateCosmicHorror(): void {
    // Ultimate attack mode
    const alivePlayers = this.session.players.filter(p => p.status === 'alive');
    const damage = BASE_MONSTER_STATS.VOID_ENTITY.damage * 2;
    
    alivePlayers.forEach(player => {
      player.health -= damage;
      if (player.health <= 0) {
        player.status = 'dead';
      }
    });
  }

  private updateBossPhase(): void {
    if (!this.monster.isBoss || !this.monster.maxBossPhases) return;
    
    const healthPercentage = this.monster.health / this.monster.maxHealth;
    const currentPhase = this.monster.bossPhase || 1;
    
    // Check if we should transition to next phase
    let nextPhase = currentPhase;
    const phaseThresholds = [
      { phase: 2, threshold: 0.66 },
      { phase: 3, threshold: 0.5 },
      { phase: 4, threshold: 0.33 },
      { phase: 5, threshold: 0.2 }
    ];
    
    for (const phaseInfo of phaseThresholds) {
      if (currentPhase < phaseInfo.phase && healthPercentage <= phaseInfo.threshold) {
        nextPhase = phaseInfo.phase;
        break;
      }
    }
    
    if (nextPhase !== currentPhase) {
      this.monster.bossPhase = nextPhase;
      // Boss phase transition effects would be handled in client
    }
  }

  private updateEffects(deltaTime: number): void {
    // Update status effects
    if (this.monster.effects.stunned) {
      this.state.velocity.x = 0;
      this.state.velocity.y = 0;
    }
    
    if (this.monster.effects.regenerating) {
      const regenAmount = this.monster.maxHealth * 0.05; // 5% per second
      this.monster.health = Math.min(this.monster.maxHealth, this.monster.health + regenAmount);
    }
  }

  private updatePosition(deltaTime: number): void {
    // Update monster position based on velocity
    const deltaSeconds = deltaTime / 1000;
    
    this.monster.position.x += this.state.velocity.x * deltaSeconds;
    this.monster.position.y += this.state.velocity.y * deltaSeconds;
    
    // Keep monster within bounds
    this.monster.position.x = Math.max(30, Math.min(870, this.monster.position.x));
    this.monster.position.y = Math.max(30, Math.min(570, this.monster.position.y));
  }

  private summonMinions(): void {
    // Summon additional crawlers (for Crawler Alpha)
    for (let i = 0; i < 2; i++) {
      const minion: ActiveMonster = {
        id: `crawler-minion-${Date.now()}-${i}`,
        type: 'CRAWLER',
        tier: 2,
        health: 75,
        maxHealth: 75,
        position: {
          x: this.monster.position.x + (Math.random() - 0.5) * 100,
          y: this.monster.position.y + (Math.random() - 0.5) * 100
        },
        velocity: { x: 0, y: 0 },
        attackCooldown: 2000,
        specialAbilities: [],
        isBoss: false,
        lastAttack: 0,
        effects: { stunned: false, slow: false, regenerating: false }
      };
      
      this.session.monsters.push(minion);
    }
  }

  public getState(): MonsterAIState {
    return { ...this.state };
  }

  public getMonster(): ActiveMonster {
    return this.monster;
  }
}

export function createMonsterAI(monster: ActiveMonster, session: SpaceshipGameSession): MonsterAI {
  return new MonsterAI(monster, session);
}