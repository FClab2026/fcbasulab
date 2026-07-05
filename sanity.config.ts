import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'
import {apiVersion, dataset, projectId} from './sanity/env'
import BulkGalleryUpload from './sanity/tools/BulkGalleryUpload'
import {UploadIcon} from '@sanity/icons'

export default defineConfig({
  name: 'default',
  title: 'Chem Web Studio',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({defaultApiVersion: apiVersion})],
  schema: {types: schemaTypes},
  tools: (prev) => [
    ...prev,
    {
      name: "bulk-gallery",
      title: "Bulk Gallery Upload",
      component: BulkGalleryUpload,
      icon: UploadIcon
    }
  ]
})
