import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import schemaTypes from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Sanity Project',
  projectId: 'ovu31njj',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    name: 'default',
    types: schemaTypes
  },
})
