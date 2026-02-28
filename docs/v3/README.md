---
description: Headless-UI for creating timelines, based on @dnd-kit
metaLinks:
  alternates:
    - https://app.gitbook.com/s/80Y6kfGWIGJve16WSQR3/
---

# 🎊 dnd-timeline

## [Try it out!](https://dnd-timeline-demo.vercel.app/)

{% content-ref url="guide/introduction.md" %}
[introduction.md](guide/introduction.md)
{% endcontent-ref %}

{% content-ref url="basic.md" %}
[basic.md](basic.md)
{% endcontent-ref %}

<table data-view="cards"><thead><tr><th align="center"></th><th></th></tr></thead><tbody><tr><td align="center"><h3>Headless 🧠</h3></td><td><code>dnd-timeline</code> is a headless-ui library, and contains 0 styling, aside from functional styling (position, z-index, etc.).</td></tr><tr><td align="center"><h3>Hook-based 🪝</h3></td><td>Exposes simple hooks like <code>useItem</code> and <code>useRow</code>, that should integrate seamlessly into your existing architecture.</td></tr><tr><td align="center"><h3>Flexible 🤺</h3></td><td>very slim and flexible by design. <code>dnd-timeline</code> exposes utility functions and positional styling, and you can use them in conjunction with your favorite libraries.</td></tr><tr><td align="center"><h3>Based on <a href="https://dndkit.com/"><code>dnd-kit</code></a></h3></td><td>All features exposed by the <a href="https://docs.dndkit.com/"><code>dnd-kit</code></a> library are applicable to <code>dnd-timeline</code>.</td></tr><tr><td align="center"><h3>Performant 🏎️</h3></td><td>Renders only when needed. All the intermediate states and animations are done using css transformations, and require 0 re-renders.</td></tr><tr><td align="center"><h3>Supports RTL 🌍</h3></td><td>Natively supports RTL. simply declare one of the parent divs as RTL with <code>dir="rtl"</code>, and thats it.</td></tr><tr><td align="center"><h3>Touch Support👆</h3></td><td>Works with touch by default. Sensors can be highly configured using <a href="https://docs.dndkit.com/api-documentation/sensors"><code>@dnd-kit</code></a>'s sensors.</td></tr></tbody></table>
