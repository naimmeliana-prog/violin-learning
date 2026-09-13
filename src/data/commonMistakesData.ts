export interface CommonMistake {
  id: string;
  name: string;
  japaneseName: string;
  category: 'Arco' | 'Mano Izquierda' | 'Postura y Violín' | 'Hombros y Cuello';
  symptom: string;
  whyBad: string;
  howToDetect: string;
  quickFix: string;
  mangaMotto: string;
  severity: 'grave' | 'moderado' | 'frecuente';
}

export const COMMON_VIOLIN_MISTAKES: CommonMistake[] = [
  {
    id: 'banana-thumb',
    name: 'El Pulgar de Plátano (Arco tieso)',
    japaneseName: '「バナナ親指の罠」',
    category: 'Arco',
    symptom: 'El pulgar de la mano derecha se queda completamente plano y tenso contra la nuez del arco.',
    whyBad: 'Bloquea por completo la articulación de la muñeca. Provoca un sonido rasposo y saltarín, y cansa la mano en menos de 5 minutos.',
    howToDetect: 'Mírate la mano derecha tocando: si la articulación del pulgar está hundida hacia dentro formando una curva cóncava como un plátano, ¡está rígido!',
    quickFix: 'Toca con la esquina de la yema del pulgar, manteniéndolo siempre flexionado hacia fuera como el muelle de un amortiguador de coche.',
    mangaMotto: '«¡El pulgar es el amortiguador ninja: si no se dobla, el arco tropieza!»',
    severity: 'grave',
  },
  {
    id: 'pancake-wrist',
    name: 'El Abrazo del Oso / Muñeca Rota',
    japaneseName: '「折れた手首・クマの抱擁」',
    category: 'Mano Izquierda',
    symptom: 'La palma de la mano izquierda se apoya o se pega contra el mástil del violín, doblando la muñeca hacia dentro.',
    whyBad: 'Inmoviliza los dedos 3 y 4 (anular y meñique), impidiendo afinarlos correctamente y haciendo imposible el cambio de posición en el futuro.',
    howToDetect: '¿Hay espacio libre bajo el mástil? Si tu palma toca la madera, estás cayendo en el abrazo del oso.',
    quickFix: 'Imagina que tu antebrazo y muñeca son un tobogán de agua continuo. Una canica imaginaria debe rodar suavemente desde tus nudillos hasta tu codo sin toparse con ninguna curva.',
    mangaMotto: '«¡Deja pasar al ratoncito! El ratón debe poder correr por debajo del mástil.»',
    severity: 'grave',
  },
  {
    id: 'drooping-scroll',
    name: 'El Violín Mirando al Suelo (Voluta caída)',
    japaneseName: '「うつむくバイオリン」',
    category: 'Postura y Violín',
    symptom: 'La voluta (cabeza del violín) apunta hacia abajo en dirección al suelo en vez de mantenerse paralela.',
    whyBad: 'Por gravedad, el arco resbala rodando hacia el batidor (diapasón) en lugar de permanecer en el carril dulce entre el puente y el diapasón. El sonido pierde proyección y volumen.',
    howToDetect: 'Comprueba si la tapa del violín está horizontal o inclinada hacia abajo.',
    quickFix: 'Elige un punto a la altura de tus ojos en la pared o imagina que la voluta apunta a una estrella en el horizonte.',
    mangaMotto: '«¡Mira a la estrella! Una virtuosa nunca deja caer su corona ni su violín.»',
    severity: 'frecuente',
  },
  {
    id: 'turtle-shoulder',
    name: 'El Hombro de Tortuga (Hombro encogido)',
    japaneseName: '「カメの肩すくめ」',
    category: 'Hombros y Cuello',
    symptom: 'Subir o encoger el hombro izquierdo hacia la oreja para sujetar el instrumento.',
    whyBad: 'Provoca contracturas en el trapecio y el cuello, bloqueando la libertad del brazo izquierdo y agotando la energía física.',
    howToDetect: 'Tócate el hombro izquierdo con la mano derecha mientras tocas: ¿está duro como una piedra o subido?',
    quickFix: 'Baja los dos hombros con una exhalación profunda. Ajusta la almohadilla (soporte de hombro) para que llene el espacio sin que tengas que levantar el hombro.',
    mangaMotto: '«¡Hombros de agua! El peso de la cabeza es más que suficiente para sujetar el violín.»',
    severity: 'grave',
  },
  {
    id: 'sawing-bow',
    name: 'El Arco Serrucho (Trayectoria torcida)',
    japaneseName: '「ノコギリ弓の斜行」',
    category: 'Arco',
    symptom: 'El arco viaja en diagonal hacia atrás de la espalda en vez de avanzar perpendicular a las cuerdas.',
    whyBad: 'Las cerdas patinan sobre las cuerdas perdiendo fricción constante, lo que genera notas sibilantes, silbidos y falta de pureza acústica.',
    howToDetect: 'Mírate en un espejo: las cerdas del arco deben formar una cruz exacta de 90 grados con las cuerdas durante todo el pase.',
    quickFix: 'Usa el codo derecho como una bisagra de puerta. Abre y cierra el antebrazo sin llevar el brazo entero hacia atrás.',
    mangaMotto: '«¡La autopista del sonido! El arco viaja en línea recta como un tren bala sobre sus raíles.»',
    severity: 'frecuente',
  },
  {
    id: 'crab-pinch',
    name: 'La Pinza de Cangrejo (Pulgar izquierdo apretado)',
    japaneseName: '「カニのハサミ・親指の圧迫」',
    category: 'Mano Izquierda',
    symptom: 'El pulgar izquierdo aprieta el lateral del mástil como una tenaza o prensa.',
    whyBad: 'La tensión se transmite a todos los tendones de los dedos de la mano izquierda, volviéndolos torpes, lentos y desafinados.',
    howToDetect: 'Mientras tocas una nota con el primer dedo, intenta deslizar suavemente el pulgar izquierdo atrás y adelante. Si está pegado y no se mueve, estás apretando con pinza.',
    quickFix: 'El pulgar solo sirve de guía de terciopelo. La fuerza para pisar la cuerda viene del peso del brazo y de los nudillos, nunca de una pinza con el pulgar.',
    mangaMotto: '«¡Caricia de seda! El pulgar descansa como una pluma rozando el mástil.»',
    severity: 'moderado',
  },
];
