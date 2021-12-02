import {Knoten} from './knoten';

export class Kante {
  knotenA: Knoten;
  knotenB: Knoten;
  color: string;
  strokeWidth: number;

  constructor( knotenA: Knoten, knotenB: Knoten, color: string, strokeWidth: number) {
    this.knotenA = knotenA;
    this.knotenB = knotenB;
    this.color = color;
    this.strokeWidth = strokeWidth;
  }
}
