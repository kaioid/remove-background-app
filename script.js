document.getElementById('imageInput').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('previewContainer');
    const preview = document.getElementById('preview');
    const downloadButton = document.getElementById('downloadButton');

    if (!file) {
        previewContainer.classList.add('hidden');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async function() {
        const base64Image = reader.result.split(',')[1];

        try {

            const response = await fetch('https://floating-garden-47142-e80febd5a65e.herokuapp.com/remove-bg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image })
            });

            if (!response.ok) throw new Error('Erro ao remover fundo da imagem');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            preview.src = url;
            previewContainer.classList.remove('hidden');

            downloadButton.disabled = false;
            downloadButton.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'image-removed-bg.png';
                a.click();
            };
        } catch (error) {
            console.error(error);
            alert('Erro ao processar a imagem');
        }
    };
    reader.readAsDataURL(file);
});

document.getElementById('preview').classList.add('hidden');