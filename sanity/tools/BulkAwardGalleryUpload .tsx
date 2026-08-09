import { useState } from 'react'
import { useClient } from 'sanity'
import { useDropzone } from 'react-dropzone'
import pLimit from 'p-limit'

export default function BulkGalleryUpload() {


    const client = useClient({
        apiVersion: '2025-01-01',
    })

    const [files, setFiles] = useState<File[]>([])
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [completed, setCompleted] = useState(0)

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            setFiles((prev) => [...prev, ...acceptedFiles])
        },
    })

    async function uploadSingle(file: File) {
        const asset = await client.assets.upload('image', file, {
            filename: file.name,
        })

        await client.create({
            _type: 'awardGalleryItem',
            image: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id,
                },
            },
        })

        setCompleted((c) => c + 1)
    }

    async function handleUpload() {
        if (!files.length) return

        setUploading(true)
        setCompleted(0)

        const limit = pLimit(5)

        try {
            await Promise.all(files.map((file) => limit(() => uploadSingle(file))))
            alert('Upload completed!')
            setFiles([])
            setDescription('')
        } catch (err) {
            console.error(err)
            alert('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div
            style={{
                maxWidth: 900,
                margin: '40px auto',
                padding: 24,
                border: '1px solid #ddd',
                borderRadius: 12,
            }}
        >
            <h1>Bulk Award Gallery Image Upload</h1>

            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #999',
                    borderRadius: 10,
                    padding: 40,
                    textAlign: 'center',
                    cursor: 'pointer',
                }}
            >
                <input {...getInputProps()} />
                <p>Drag & Drop Images Here</p>
                <p>or click to browse</p>
            </div>

            {files.length > 0 && (
                <>
                    <h3 style={{ marginTop: 30 }}>
                        {files.length} image(s) selected
                    </h3>

                    <ul
                        style={{
                            maxHeight: 250,
                            overflow: 'auto',
                        }}
                    >
                        {files.map((file) => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                </>
            )}

            {uploading && (
                <div style={{ marginTop: 20 }}>
                    <progress
                        value={completed}
                        max={files.length}
                        style={{ width: '100%' }}
                    />

                    <p>
                        {completed} / {files.length} uploaded
                    </p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                style={{
                    marginTop: 25,
                    padding: '12px 20px',
                    fontSize: 16,
                    cursor: 'pointer',
                }}
            >
                {uploading
                    ? 'Uploading...'
                    : `Upload ${files.length} Images`}
            </button>
        </div>
    )
}