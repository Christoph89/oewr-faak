/* jquery.scrollex.d.ts - (c) Christoph Schaunig 2017 */

interface JQueryScrollexOptions
{
  top?: string;
  bottom?: string;
  delay?: number;
  initialize?: () => void;
  terminate?: () => void;
  enter?: () => void;
  leave?: () => void;
}

interface JQuery
{
  scrollex(opt?: JQueryScrollexOptions): JQuery;
  unscrollex(): JQuery;
}