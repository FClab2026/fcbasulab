import dotenv from 'dotenv'

dotenv.config({path: '.env'})
async function seedAlumni() {
  // Import after loading .env.local
  const { writeClient} = await import('@/sanity/lib/client')
  const client = writeClient

  // Load JSON
  const alumni = (await import('./trash/new.json', {
    with: {type: 'json'},
  })).default

  console.log(`Found ${alumni.length} alumni to seed.`)

  // Convert our clean JSON into Sanity documents
  const documents = alumni.map((person) => ({
    _type: 'alumni',
    name: person.name,
    year: person.year,
    category: person.category,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: person.body,
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  }))

  // Create all documents
  const transaction = client.transaction()

  for (const document of documents) {
    transaction.create(document)
  }

  await transaction.commit()

  console.log(`Successfully seeded ${documents.length} alumni.`)
}

seedAlumni().catch((error) => {
  console.error('Failed to seed alumni:', error)
  process.exit(1)
})