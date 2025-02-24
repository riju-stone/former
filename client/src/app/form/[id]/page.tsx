import React, { use } from 'react'

function FormPublishedPage({ params }: { params: Promise<string> }) {
    const id = use(params)

    return (
        <div>FormPunlishedPage</div>
    )
}

export default FormPublishedPage
