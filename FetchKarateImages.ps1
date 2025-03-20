# Script to prepare prompts for manual image generation and create folder structure

# Base directory for images
$baseDir = ".\images"
if (-not (Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir | Out-Null
}

# Define prompts and file paths
$imageData = @(
    # White Belt
    @{ Prompt = "A karate student in a white gi performing Zenkutsu-dachi front stance, side view, simple background"; Path = "$baseDir\white\stance1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Zenkutsu-dachi front stance, karate, white gi"; Path = "$baseDir\white\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Kiba-dachi horse stance, karate, white gi"; Path = "$baseDir\white\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Kokutsu-dachi back stance, karate, white gi"; Path = "$baseDir\white\option3.jpg"; Width = 100; Height = 80 },

    # Yellow Belt
    @{ Prompt = "A karate student in a yellow gi performing Mawashi-geri roundhouse kick, dynamic pose, simple background"; Path = "$baseDir\yellow\technique1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Oi-zuki stepping punch, karate, yellow gi"; Path = "$baseDir\yellow\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Gyaku-zuki reverse punch, karate, yellow gi"; Path = "$baseDir\yellow\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Mawashi-geri roundhouse kick, karate, yellow gi"; Path = "$baseDir\yellow\option3.jpg"; Width = 100; Height = 80 },

    # Orange Belt
    @{ Prompt = "A karate student in an orange gi performing Soto-uke outside block, side view, simple background"; Path = "$baseDir\orange\block1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Age-uke upper block, karate, orange gi"; Path = "$baseDir\orange\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Shuto-uke knife-hand block, karate, orange gi"; Path = "$baseDir\orange\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Soto-uke outside block, karate, orange gi"; Path = "$baseDir\orange\option3.jpg"; Width = 100; Height = 80 },

    # Green Belt
    @{ Prompt = "A karate student in a green gi performing Nukite spear-hand strike, front view, simple background"; Path = "$baseDir\green\technique1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Nukite spear-hand strike, karate, green gi"; Path = "$baseDir\green\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Shuto-uke knife-hand block, karate, green gi"; Path = "$baseDir\green\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Mawashi-geri roundhouse kick, karate, green gi"; Path = "$baseDir\green\option3.jpg"; Width = 100; Height = 80 },

    # Blue Belt
    @{ Prompt = "A karate student in a blue gi performing Mae-geri front kick, side view, simple background"; Path = "$baseDir\blue\kick1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Mae-geri front kick, karate, blue gi"; Path = "$baseDir\blue\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Yoko-geri side kick, karate, blue gi"; Path = "$baseDir\blue\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Mawashi-geri roundhouse kick, karate, blue gi"; Path = "$baseDir\blue\option3.jpg"; Width = 100; Height = 80 },

    # Purple Belt
    @{ Prompt = "A karate student in a purple gi performing Kiba-dachi horse stance, front view, simple background"; Path = "$baseDir\purple\stance1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Kiba-dachi horse stance, karate, purple gi"; Path = "$baseDir\purple\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Zenkutsu-dachi front stance, karate, purple gi"; Path = "$baseDir\purple\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Kokutsu-dachi back stance, karate, purple gi"; Path = "$baseDir\purple\option3.jpg"; Width = 100; Height = 80 },

    # Brown Belt
    @{ Prompt = "A karate student in a brown gi performing Empi-uchi elbow strike, side view, simple background"; Path = "$baseDir\brown\technique1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Empi-uchi elbow strike, karate, brown gi"; Path = "$baseDir\brown\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Nukite spear-hand strike, karate, brown gi"; Path = "$baseDir\brown\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Yoko-geri side kick, karate, brown gi"; Path = "$baseDir\brown\option3.jpg"; Width = 100; Height = 80 },

    # Black Belt
    @{ Prompt = "A karate student in a black gi performing Ushiro-geri back kick, side view, simple background"; Path = "$baseDir\black\kick1.jpg"; Width = 300; Height = 200 },
    @{ Prompt = "Small illustration of Mawashi-geri roundhouse kick, karate, black gi"; Path = "$baseDir\black\option1.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Yoko-geri side kick, karate, black gi"; Path = "$baseDir\black\option2.jpg"; Width = 100; Height = 80 },
    @{ Prompt = "Small illustration of Ushiro-geri back kick, karate, black gi"; Path = "$baseDir\black\option3.jpg"; Width = 100; Height = 80 }
)

# Create folder structure
foreach ($item in $imageData) {
    $dir = Split-Path $item.Path -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}

# Output prompts to a text file for manual use
$outputFile = ".\KarateImagePrompts.txt"
$imageData | ForEach-Object {
    "Prompt: $($_.Prompt) -> Save as: $($_.Path) (Size: $($_.Width)x$($_.Height)px)"
} | Out-File $outputFile

Write-Host "Folder structure created and prompts saved to $outputFile"
Write-Host "Please follow these steps:"
Write-Host "1. Open https://www.craiyon.com/ in your browser."
Write-Host "2. Copy each prompt from $outputFile and paste it into Craiyon."
Write-Host "3. Generate images, pick the best one, and download it."
Write-Host "4. Resize the image to the specified size (300x200px for questions, 100x80px for options) using a tool like Photopea (https://www.photopea.com/)."
Write-Host "5. Save the resized image to the path listed in the file."
Write-Host "Repeat for all 32 prompts."