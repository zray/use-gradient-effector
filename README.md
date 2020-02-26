# use-gradient-effector

> Modify a matrix of values with an offscreen gradient

[![NPM](https://img.shields.io/npm/v/use-gradient-effector.svg)](https://www.npmjs.com/package/use-gradient-effector) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-gradient-effector
```

## Usage

```jsx
import React, { Component } from 'react'

import { useGradientEffector } from 'use-gradient-effector'

const Example = () => {
  const gradientValues = useGradientEffector()
  return (
    <div>{example}</div>
  )
}
```

## Todo
[] Get columns working again
[] Add noise layer and multiplier
[] Make use of other channels for layers
[] Add linear/radial argument

## License

MIT © [zray](https://github.com/zray)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
