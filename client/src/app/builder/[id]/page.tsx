import React, { use } from 'react'

function FormPublishedPage({ params }: { params: Promise<{ id: string }> }) {
    const id = use(params)

    return (
        <div>FormPublishedPage</div>
    )
}

export default FormPublishedPage
