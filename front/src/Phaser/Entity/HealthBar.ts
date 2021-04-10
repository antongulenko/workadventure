import Scene = Phaser.Scene;
import {Character} from "./Character";

//todo: improve this WIP
export class HealthBar {
    private bar: Phaser.GameObjects.Image|null = null;
    private deathText: Phaser.GameObjects.Text|null = null;
    private currentTextureName: String = "";
    private displayedDeaths: number = -1;

    private player: Character;
    private scene: Scene;

    private hpLength = 35
    private hpWidth = 3
    private barPaddingX = 2
    private barPaddingY = 2
    private boxWidth = this.hpLength + 2*this.barPaddingX
    private boxHeight = this.hpWidth + 2*this.barPaddingY
    private barX = 0
    private barY = -(this.boxHeight + 33)
    private textX = this.barX + this.boxWidth/2 + 2
    private textY = this.barY - 5

    constructor(scene: Scene, player: Character) {
        this.player = player;
        this.scene = scene;

        this.update();
    }

    update() {
        this.updateHealthbar()
        this.updateDeaths()
    }

    updateHealthbar(): void {
        if (this.player.health >= 100 && this.player.deaths == 0) {
            // Do not show health bar on full HP
            this.clearBar();
            return;
        }

        const textureName = this.ensureHealthBarTexture(this.player.health)
        if (textureName == this.currentTextureName) {
            // Already showing correct health bar
            return;
        }

        this.clearBar();
        this.bar = this.scene.add.image(this.barX, this.barY, textureName)
        this.player.add(this.bar)
        this.currentTextureName = textureName
    }

    updateDeaths(): void {
        if (this.player.deaths <= 0) {
            // Do not show zero deaths
            this.clearDeaths()
            return;
        }

        if (this.displayedDeaths == this.player.deaths) {
            // Correct deaths already displayed
            return;
        }

        const text = "☠" + String(this.player.deaths)
        this.deathText = this.scene.add.text(this.textX, this.textY, text, { fontFamily: 'Arial', fontSize: '40', color: '#700009', align: 'left' })
        this.player.add(this.deathText)
        this.displayedDeaths = this.player.deaths
    }

    ensureHealthBarTexture(health: number): string {
        if (health < 0) health = 0;
        const textureName = "healthbar-" + String(health);
        if (this.scene.textures.exists(textureName)) {
            return textureName;
        }

        const cornerRadius = 2

        const bar = this.scene.add.graphics();

        //  box shadow
        bar.fillStyle(0x222222, 0.5);
        bar.fillRoundedRect(3, 3, this.boxWidth, this.boxHeight, cornerRadius);

        //  box shape and outline
        bar.fillStyle(0xffffff, 1);
        bar.lineStyle(4, 0x565656, 1);
        bar.strokeRoundedRect(0, 0, this.boxWidth, this.boxHeight, cornerRadius);
        bar.fillRoundedRect(0, 0, this.boxWidth, this.boxHeight, cornerRadius);

        //  actual health bar
        const hpPixels = this.hpLength * (health / 100);
        const hpStartX = this.barPaddingX;
        const hpStartY = this.barPaddingY + this.hpWidth/2;
        const hpEndX = hpStartX + hpPixels;
        const hpEndY = hpStartY;
        let color;
        if (health > 40) {
            color = 0x08730c; // Green
        } else if (health > 20) {
            color = 0xd19834; // Orange
        } else {
            color = 0xa81d0d; // Red
        }
        bar.lineStyle(this.hpWidth, color, 1);
        bar.lineBetween(hpStartX, hpStartY, hpEndX, hpEndY);
        bar.generateTexture(textureName, this.boxWidth, this.boxHeight);
        return textureName;
    }

    clearBar(): void {
        //todo find a better way
        if (this.bar != null) {
            this.bar.setVisible(false)
            this.bar.destroy()
            this.bar = null;
            this.currentTextureName = ""
        }
    }

    clearDeaths(): void {
        //todo find a better way
        if (this.deathText != null) {
            this.deathText.setVisible(false)
            this.deathText.destroy()
            this.deathText = null;
            this.displayedDeaths = -1
        }
    }

    destroy() {
        this.clearBar()
        this.clearDeaths()
    }
}
