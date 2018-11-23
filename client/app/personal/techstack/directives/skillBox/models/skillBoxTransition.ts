export default class SkillBoxTransition {
    constructor(
        public top: number,
        public left: number,
        public width: number,
        public height: number,
        public wrapper: SkillBoxWrapperTransition,
        public rate: SkillBoxRateTransition,
        public overlay: SkillBoxOverlayTransition,
        public content: SkillBoxContentTransition) { }

    toObject() {
        return {
            width: this.width + 'px',
            height: this.height + 'px',
            top: this.top,
            left: this.left
        };
    }
}

export class SkillBoxWrapperTransition {
    constructor(public angle: number) { }

    toObject() {
        return {
            rotateZ: this.angle + 'deg',
            translateX: '0px',
            translateY: '0px',
            translateZ: '1px'
        };
    }
}

export class SkillBoxRateTransition {
    constructor(public fontSize: string) { }

    toObject() {
        if (!this.fontSize.endsWith('px')) {
            this.fontSize += 'px';
        }

        return {
            fontSize: this.fontSize,
            lineHeight: this.fontSize
        };
    }
}

export class SkillBoxOverlayTransition {
    constructor(public opacity: number) { }

    toObject() {
        return {
            opacity: this.opacity
        };
    }
}

export class SkillBoxContentTransition {
    constructor(public opacity: number) { }

    toObject() {
        return {
            opacity: this.opacity
        };
    }
}
