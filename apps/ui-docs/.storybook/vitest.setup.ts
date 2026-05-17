import { setProjectAnnotations } from '@storybook/react-vite'
import { beforeAll } from 'vitest'
import * as projectAnnotations from './preview'

const project = setProjectAnnotations([projectAnnotations.default])

beforeAll(project.beforeAll)
