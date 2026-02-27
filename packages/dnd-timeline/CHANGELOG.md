

## [3.0.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.4.0...dnd-timeline@3.0.0) (2026-02-27)


### ⚠ BREAKING CHANGES

* sidebarRef and setSidebarRef have been removed from the
TimelineBag and useRow API. sidebarWidth is now a required prop on
TimelineContext instead of optional.

- Remove sidebarRef, setSidebarRef, and isSidebarWidthControlled from TimelineBag
- Remove sidebarRef measurement via useElementRef in useTimeline
- Make sidebarWidth a required prop in UseTimelineProps
- rowSidebarStyle from useRow now always includes width: sidebarWidth
- setSidebarRef is no longer returned from useRow
- Update all examples to pass sidebarWidth to TimelineContext
- Update docs to reflect the new required sidebarWidth prop

### Features

* drop sidebarRef support and make sidebarWidth a required prop ([cf01439](https://github.com/samuelarbibe/dnd-timeline/commit/cf01439a1007c702ee9f574c3e2f1ba53435f66e))


### Reverts

* undo doc changes ([6ca6484](https://github.com/samuelarbibe/dnd-timeline/commit/6ca6484e01aded4cc0385179e27dbad725cca81e))

## [2.4.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.3.0...dnd-timeline@2.4.0) (2026-02-27)


### Features

* add sidebarWidth prop to TimelineContext ([04d3030](https://github.com/samuelarbibe/dnd-timeline/commit/04d3030c1e5e29edfb2eed9306c3c01982f1b706))

## [2.3.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.2.0...dnd-timeline@2.3.0) (2026-01-31)


### Features

* add useTimelineMonitor hook and support for resize listeners ([b342fb7](https://github.com/samuelarbibe/dnd-timeline/commit/b342fb7f752d257a1a6b56a345ad2f7f0afbd794))

## [2.2.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.1.2...dnd-timeline@2.2.0) (2025-07-30)


### Features

* add resizeHandleWidth prop to item ([b27616c](https://github.com/samuelarbibe/dnd-timeline/commit/b27616c836bebc04d6056becb6b634df27fb28a5))

## [2.1.2](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.1.1...dnd-timeline@2.1.2) (2025-03-06)


### Bug Fixes

* memoize onPanEnd and send it the the full timelineBag ([e0fd895](https://github.com/samuelarbibe/dnd-timeline/commit/e0fd895e3c13f7bee2022cef5eafdc88e3b38772))

## [2.1.1](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.1.0...dnd-timeline@2.1.1) (2024-12-20)


### Bug Fixes

* memoize useItem and useRow styles ([3e5136a](https://github.com/samuelarbibe/dnd-timeline/commit/3e5136a219752c5db5ad76d8ec803656bebb4d4d))

## [2.1.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.0.2...dnd-timeline@2.1.0) (2024-12-20)


### Features

* add getDeltaXFromScreenX ([17e1dc8](https://github.com/samuelarbibe/dnd-timeline/commit/17e1dc8b3fc41ef18d156631b51e7310a5e43832))

## [2.0.2](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.0.1...dnd-timeline@2.0.2) (2024-10-03)


### Bug Fixes

* add activatorEvent to resize events ([3463841](https://github.com/samuelarbibe/dnd-timeline/commit/34638416d6e1abd63a2b7fff4f943ab54059e730))

## [2.0.1](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.0.0...dnd-timeline@2.0.1) (2024-08-23)


### Bug Fixes

* store timeframe ref in useState ([4e7b3cc](https://github.com/samuelarbibe/dnd-timeline/commit/4e7b3cc8003adfcaf98083a91da4f4b23236d678))
* timecursor overflows to sidebar ([9f8a835](https://github.com/samuelarbibe/dnd-timeline/commit/9f8a83512f2b04f8db0bb21026cf062ed8ed5ea3))
* use custom autoscroll with virtualization ([e0e747b](https://github.com/samuelarbibe/dnd-timeline/commit/e0e747b4d2a4faa6911d427b229f12f6d92f750c))

## [2.0.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@2.0.0-beta.0...dnd-timeline@2.0.0) (2024-06-20)

## [2.0.0-beta.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.6.3...dnd-timeline@2.0.0-beta.0) (2024-06-20)


### ⚠ BREAKING CHANGES

* use numbers instead of dates

### Features

* use numbers instead of dates ([e061c6b](https://github.com/samuelarbibe/dnd-timeline/commit/e061c6b5eea4d0c96ee97ee74a2d52099901ab12))


### Bug Fixes

* add passive option to pan strategy event handlers ([8a56eb9](https://github.com/samuelarbibe/dnd-timeline/commit/8a56eb9e030e52130577e48efa59fca386bb049f))
* update examples to use range instead of timeframe ([66c03a1](https://github.com/samuelarbibe/dnd-timeline/commit/66c03a1852f4e7c6b7b2041291fa281b3eda77fa))

## [1.6.3](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.6.2...dnd-timeline@1.6.3) (2024-05-23)


### Performance Improvements

* use number instead of Date internally ([028fa4b](https://github.com/samuelarbibe/dnd-timeline/commit/028fa4b9e154af4d9f328904b6b85713f0a22d1f))

## [1.6.2](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.6.1...dnd-timeline@1.6.2) (2024-05-09)


### Bug Fixes

* make getRelevanceFromResizeEvent and getRelevanceFromDragEvent optional ([34ae591](https://github.com/samuelarbibe/dnd-timeline/commit/34ae59172a88c7f8391928ee7191adabcee390e1))

## [1.6.1](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.6.0...dnd-timeline@1.6.1) (2024-03-16)


### Bug Fixes

* refactor drag and resize events types ([1009d35](https://github.com/samuelarbibe/dnd-timeline/commit/1009d35e3d36fef1692ea2b55ca5de9fab53a0e2))

## [1.6.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.5.1...dnd-timeline@1.6.0) (2024-03-15)


### Features

* replace sidebarWidth with sidebarRef ([0d7b4cf](https://github.com/samuelarbibe/dnd-timeline/commit/0d7b4cf89b78aaa485321450430cfe4f77364e0f))


### Bug Fixes

* add demo page ([5004002](https://github.com/samuelarbibe/dnd-timeline/commit/50040027d29081734dda8b33d113ceb0e1398d15))
* initialize demo example ([c8357a3](https://github.com/samuelarbibe/dnd-timeline/commit/c8357a393ed596039ab8cbc2f5c97582f6c0b441))

## [1.5.1](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.5.0...dnd-timeline@1.5.1) (2024-03-07)


### Bug Fixes

* add performence example ([e30daff](https://github.com/samuelarbibe/dnd-timeline/commit/e30daff24fab157b63303ea092af3a2a61adece4))
* add useDeferredValue example to performance ([2fd07d3](https://github.com/samuelarbibe/dnd-timeline/commit/2fd07d3a38cf5ae730f305cef77b62cc837d5897))

## [1.5.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.4.4...dnd-timeline@1.5.0) (2024-02-01)


### Features

* accept broader item type in grouping util functions ([fdc68d6](https://github.com/samuelarbibe/dnd-timeline/commit/fdc68d6aa292ef3e98bf9d4e3662e91ef07de579))
* add resizeHandleWidth prop ([239ff9e](https://github.com/samuelarbibe/dnd-timeline/commit/239ff9ee7a038de127a6f20295f7075dcfc018f4))


### Bug Fixes

* add default type ([c7d9f5d](https://github.com/samuelarbibe/dnd-timeline/commit/c7d9f5defdf7f69488982daf2d6704e0f09bba4c))
* example items' end border is visible on content overflow ([9ab70ec](https://github.com/samuelarbibe/dnd-timeline/commit/9ab70ec194188ca8441e921b0fc2c9c96060451b))
* rename type ([c3969b7](https://github.com/samuelarbibe/dnd-timeline/commit/c3969b7aa291f45781cacb1470d3f601c5c743e3))

## [1.4.4](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.4.3...dnd-timeline@1.4.4) (2024-01-20)


### Bug Fixes

* comments ([b7fb89a](https://github.com/samuelarbibe/dnd-timeline/commit/b7fb89a899ceb2414dd7f4a6cf6f7701a826df36))
* overflowX in virtual example ([9b79cdc](https://github.com/samuelarbibe/dnd-timeline/commit/9b79cdcbd5ffb05d3c4ffe1b89d2c2ff86708269))
* set padding-end if item goes out of timeframe from its end ([97592fd](https://github.com/samuelarbibe/dnd-timeline/commit/97592fd11c2d85af5500141ffa60da30698a3d26))

## [1.4.3](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.4.2...dnd-timeline@1.4.3) (2023-12-22)

## [1.4.2](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.4.0...dnd-timeline@1.4.2) (2023-12-22)


### Bug Fixes

* set touchAction to none to enable touch pointer events ([a7eb585](https://github.com/samuelarbibe/dnd-timeline/commit/a7eb585912eb5d5e61f0b0ec76b2689c220c999f))

## [1.4.0](https://github.com/samuelarbibe/dnd-timeline/compare/dnd-timeline@1.3.1...dnd-timeline@1.4.0) (2023-12-22)


### Features

* add touchAction manipulation to itemStyle to support touch ([0029b1e](https://github.com/samuelarbibe/dnd-timeline/commit/0029b1ee0a33744deee325bf169ddc0cc9b44be8))
