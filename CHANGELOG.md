## [1.1.1] - 2021-02-01

### Fixed

* CSS escape to avoid "Uncaught DOMException: Failed to execute 'querySelector' on 'Document'"


## [1.1.0] - 2020-11-09

### Added

* Introduce "initialTicks" option for unconstrained initial layout iterations.


## [1.0.2] - 2020-06-29

### Added

* Create an npm package of inet-henge so that users can use it in other projects, even customize and rebuild.
* Rewrote all .js with .ts to reuse in typescript projects.
* Update the build environment, which was .js + babel + browserify, with .ts + webpack + ts-loader.


## [1.0.0] - 2020-02-25

### Added

* Start versioning.

### Fixed

* Change SVG DOM structure to render link labels in front of nodes.
  * :warning: This change breaks backward compatibility in CSS. Use `.link line` instead of `.link`, `.link text` instead of `.path-label`, and `.link text.hover` instead of `.link:hover ~ .path-label ` for instance.

#### Previous SVG DOM

```svg
<svg width="960" height="600">
    <g>
        <g transform="...">
            <rect width="9600" height="6000" transform="translate(-4800, -3000)" style="opacity: 0;"></rect>

            <!-- Group definition -->
            <g class="group pop03" transform="translate(462.13786327372185, 31.609395906680902)">
                <rect rx="8" ry="8" width="224.02789064247673" height="218.51666231118884" style="fill: rgb(255, 127, 14);"></rect>
                <text>POP03</text>
            </g>

            <!-- Link definition -->
            <g class="path-group">
                <line class="link pop03-bb01 pop03-bb02 pop03-bb01-pop03-bb02 " x1="493.13786327372185" y1="183.41381777944147" x2="574.8771135543029" y2="229.12605821786974" stroke="#7a4e4e" stroke-width="3" id="link2" transform="translate(0, 0)"></line>
                <path class="path" d="M 493.13786327372185 183.41381777944147 L 574.8771135543029 229.12605821786974" id="path2" transform="translate(0, 0)"></path>
                <text class="path-label" pointer-events="none" style="visibility: visible;" transform="rotate(0)">
                    <textPath xlink:href="#path2">
                        <tspan x="20" dy="1.5em" class="interface">ge-0/0/0</tspan>
                    </textPath>
                </text>
                <text class="path-label" pointer-events="none" style="visibility: visible;" transform="rotate(0)">
                    <textPath xlink:href="#path2" class="reverse" text-anchor="end" startOffset="100%">
                        <tspan x="-20" dy="1.5em" class="interface">Te0/0/0/0</tspan>
                    </textPath>
                </text>
            </g>

            <!-- Node definition -->
            <g id="pop03-bb02" name="POP03-bb02" transform="translate(547.8771135543029, 212.12605821786974)" class="node rect pop03-bb02 ">
                <rect width="54" height="34" rx="5" ry="5" style="fill: rgb(255, 187, 120);"></rect>
                <text text-anchor="middle" x="30" y="20">
                    <tspan x="30">POP03-bb02</tspan>
                </text>
            </g>
            ...
        </g>
    </g>
</svg>
```

#### v1.0.0's SVG DOM


```svg
<svg width="960" height="600">
    <g>
        <g transform="...">
            <rect width="9600" height="6000" transform="translate(-4800, -3000)" style="opacity: 0;"></rect>

            <!-- Group definition -->
            <g id="groups">
                ...
                <g class="group pop03" transform="translate(462.13786327372185, 31.609395906680902)">
                    <rect rx="8" ry="8" width="224.02789064247673" height="218.51666231118884" style="fill: rgb(255, 127, 14);"></rect>
                    <text>POP03</text>
                </g>
            </g>

            <!-- Link definition -->
            <g id="links">
                ...
                <g class="link pop03-bb01 pop03-bb02 pop03-bb01-pop03-bb02 ">
                    <line x1="493.13786327372185" y1="183.41381777944147" x2="574.8771135543029" y2="229.12605821786974" stroke="#7a4e4e" stroke-width="3" id="link2" transform="translate(0, 0)"></line>
                    <path d="M 493.13786327372185 183.41381777944147 L 574.8771135543029 229.12605821786974" id="path2" transform="translate(0, 0)"></path>
                </g>
                ...
            </g>

            <!-- Node definition -->
            <g id="nodes">
                ...
                <g id="pop03-bb02" name="POP03-bb02" transform="translate(547.8771135543029, 212.12605821786974)" class="node rect pop03-bb02 ">
                    <rect width="54" height="34" rx="5" ry="5" style="fill: rgb(255, 187, 120);"></rect>
                    <text text-anchor="middle" x="30" y="20">
                        <tspan x="30">POP03-bb02</tspan>
                    </text>
                </g>
                ...
            </g>

            <!-- Link label definition -->
            <g id="link-labels">
                ...
                <g class="link pop03-bb01 pop03-bb02 pop03-bb01-pop03-bb02 ">
                    <text class="path2" transform="rotate(0)" style="visibility: visible;">
                        <textPath xlink:href="#path2">
                            <tspan x="20" dy="1.5em" class="interface">ge-0/0/0</tspan>
                        </textPath>
                    </text>
                    <text class="path2" transform="rotate(0)" style="visibility: visible;">
                        <textPath xlink:href="#path2" class="reverse" text-anchor="end" startOffset="100%">
                            <tspan x="-20" dy="1.5em" class="interface">Te0/0/0/0</tspan>
                        </textPath>
                    </text>
                </g>
                ...
            </g>
        </g>
    </g>
</svg>
```
