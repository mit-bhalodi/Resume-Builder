export const SlideUpAnimationMenu = {
    initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }
}

export const FadeInOutWithOpacity = {
    initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }
}

export const ScaleInOut = (index) => {
    return { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, transition: { delay: index * 0.3, ease: 'easeInOut' } }
}