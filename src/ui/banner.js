import { c } from './colors.js';
import { createBox } from './box.js';

export const ASCII_LOGO = `
 ██╗   ██╗███████╗██╗     ██╗  ██╗
 ██║   ██║██╔════╝██║     ╚██╗██╔╝
 ██║   ██║█████╗  ██║      ╚███╔╝ 
 ╚██╗ ██╔╝██╔══╝  ██║      ██╔██╗ 
  ╚████╔╝ ███████╗███████╗██╔╝ ██╗
   ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝
`;

export function showBanner() {
  console.log(c.gradient(ASCII_LOGO.trim(), ['#FF61D2', '#5271FF', '#12D8FA']));
  console.log(
    c.bold(c.hex('#8892b0')('  ⚡ The Zero-Dependency Developer Cockpit & Swiss-Army CLI')) +
    c.hex('#5271FF')(' [v1.0.0]\n')
  );
}

export { createBox };
