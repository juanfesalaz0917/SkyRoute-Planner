/**
 * Represents a directed weighted edge in the flight network graph.
 *
 * The graph is directed: if route A→B exists, B→A must be declared
 * explicitly in the JSON. There is no implicit reverse edge.
 *
 * The 'bloqueada' flag is set by the interruption service to simulate
 * airspace closures, adverse weather, or airline cancellations. Blocked
 * routes remain in the adjacency list but are excluded from all path searches.
 *
 * Subsidised routes (costoBase === 0) have free flight cost. The traveler
 * cannot use subsidised routes for more than 20 % of the total trip distance.
 */
export class Route {
  /** IATA code of the origin airport */
  readonly origen: string;
  /** IATA code of the destination airport */
  readonly destino: string;
  /** Distance of the leg in kilometres */
  readonly distanciaKm: number;
  /** Aircraft type names available on this route */
  readonly aeronaves: string[];
  /** Override cost; 0 means the route is subsidised */
  readonly costoBase: number;
  /** Minimum stay at the destination in minutes */
  readonly estanciaMinima: number;
  /** True when the route is currently interrupted */
  bloqueada: boolean;

  constructor(
    origen: string,
    destino: string,
    distanciaKm: number,
    aeronaves: string[],
    costoBase: number = 0.0,
    estanciaMinima: number = 60
  ) {
    this.origen = origen;
    this.destino = destino;
    this.distanciaKm = distanciaKm;
    this.aeronaves = aeronaves;
    this.costoBase = costoBase;
    this.estanciaMinima = estanciaMinima;
    this.bloqueada = false;
  }

  /** True when this is a subsidised (zero-cost) route. */
  get esSubsidiada(): boolean {
    return this.costoBase === 0.0;
  }

  /** Block this route, simulating an interruption event. */
  bloquear(): void {
    this.bloqueada = true;
  }

  /** Restore a previously blocked route. */
  desbloquear(): void {
    this.bloqueada = false;
  }

  toString(): string {
    const estado = this.bloqueada ? " [BLOQUEADA]" : "";
    const sub = this.esSubsidiada ? " [SUBSIDIADA]" : "";
    return `Route(${this.origen} → ${this.destino}, ${this.distanciaKm} km${sub}${estado})`;
  }
}
