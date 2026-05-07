jadi cv summarizer ini sebenarnya akan saya ubah layoutnya menyesuaikan dengan website yang akan saya integrasikan yaitu namanya acc career, nah tujuan saya disini adalah menyesuaikan layout seperti acc career, makanya disni saya ingin membuat replikanya. kenapa tidak saya integrasikan langsung di website acc careernya? karena masalah secruity dan kami anak magang tidak boleh langusng mengubah sistem acc careernya, maka dari itu saya disini mencoba membuat replikanya dengan di tambahkan cv summarizer ini:

yang pertama ada halaman job posting management, di halaman ini ada button post a job dan juga ada table hasil dari tampilan post a job


<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "on-surface-variant": "#414750",
                      "secondary-fixed": "#ffdcc2",
                      "on-primary-container": "#a5cbff",
                      "surface-bright": "#f8f9fa",
                      "on-error": "#ffffff",
                      "on-surface": "#191c1d",
                      "surface-container": "#edeeef",
                      "surface-dim": "#d9dadb",
                      "primary-fixed-dim": "#a1c9ff",
                      "on-primary": "#ffffff",
                      "inverse-primary": "#a1c9ff",
                      "secondary-fixed-dim": "#ffb77c",
                      "inverse-surface": "#2e3132",
                      "surface-variant": "#e1e3e4",
                      "surface-container-highest": "#e1e3e4",
                      "background": "#f8f9fa",
                      "on-secondary-fixed-variant": "#6d3900",
                      "on-error-container": "#93000a",
                      "on-secondary-fixed": "#2e1500",
                      "surface-container-high": "#e7e8e9",
                      "tertiary-container": "#4e5559",
                      "surface-container-lowest": "#ffffff",
                      "inverse-on-surface": "#f0f1f2",
                      "outline": "#727781",
                      "on-secondary-container": "#693600",
                      "primary-container": "#005696",
                      "surface": "#f8f9fa",
                      "on-tertiary-fixed-variant": "#41484c",
                      "on-tertiary-fixed": "#151d20",
                      "tertiary": "#373e42",
                      "on-primary-fixed": "#001c37",
                      "on-secondary": "#ffffff",
                      "tertiary-fixed-dim": "#c0c7cc",
                      "secondary": "#904d00",
                      "surface-tint": "#1961a1",
                      "on-tertiary": "#ffffff",
                      "on-tertiary-container": "#c2c9ce",
                      "error-container": "#ffdad6",
                      "primary-fixed": "#d2e4ff",
                      "outline-variant": "#c1c7d2",
                      "tertiary-fixed": "#dce3e8",
                      "secondary-container": "#fe9835",
                      "primary": "#003e6f",
                      "on-primary-fixed-variant": "#004880",
                      "on-background": "#191c1d",
                      "surface-container-low": "#f3f4f5",
                      "error": "#ba1a1a"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "gutter": "16px",
                      "section-gap": "32px",
                      "unit": "4px",
                      "row-padding": "12px 16px",
                      "container-margin": "24px"
              },
              "fontFamily": {
                      "headline-md": ["Inter"],
                      "body-sm": ["Inter"],
                      "body-lg": ["Inter"],
                      "headline-xl": ["Inter"],
                      "headline-lg": ["Inter"],
                      "body-md": ["Inter"],
                      "label-md": ["Inter"],
                      "table-header": ["Inter"]
              },
              "fontSize": {
                      "headline-md": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}],
                      "body-sm": ["12px", {"lineHeight": "1.5", "fontWeight": "400"}],
                      "body-lg": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                      "headline-xl": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
                      "headline-lg": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                      "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                      "label-md": ["13px", {"lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "600"}],
                      "table-header": ["14px", {"lineHeight": "1.2", "fontWeight": "600"}]
              }
            },
          },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        body {
            background-color: #f8f9fa;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
<!-- TopNavBar -->
<header class="bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container font-headline-md text-headline-md docked full-width top-0 flex justify-between items-center w-full px-container-margin py-4 transition-all duration-200 active:opacity-90">
<div class="flex items-center gap-12">
<span class="font-headline-lg text-headline-lg font-bold text-on-primary dark:text-on-primary-container">ACC Career</span>
<nav class="hidden md:flex gap-8 items-center">
<a class="text-on-primary border-b-2 border-secondary-container pb-1 font-bold transition-all duration-200" href="#">Job Posting</a>
<a class="text-on-primary/80 hover:text-on-primary transition-colors transition-all duration-200" href="#">Job Listing</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="bg-secondary-container text-on-secondary-container px-6 py-2 rounded font-label-md transition-all duration-200 hover:bg-primary-fixed-dim/10">
                Post a Job
            </button>
</div>
</header>
<!-- Page Header Hero Section -->
<section class="bg-primary-container text-on-primary-container px-container-margin py-12">
<div class="max-w-[1280px] mx-auto">
<h1 class="font-headline-xl text-headline-xl mb-2 text-on-primary">Job Posting Management</h1>
<p class="font-body-md text-on-primary/70">Manage and monitor all recruitment requests and published job listings from a centralized dashboard.</p>
</div>
</section>
<!-- Main Content Canvas -->
<main class="flex-grow px-container-margin py-section-gap max-w-[1280px] mx-auto w-full">
<!-- Action Row -->
<div class="flex justify-end items-center mb-6">
<button class="bg-secondary-container text-on-secondary-container px-8 py-3 rounded shadow-sm font-label-md flex items-center gap-2 hover:opacity-90 transition-all">
<span class="material-symbols-outlined" data-icon="add">add</span>
                Post a Job
            </button>
</div>
<!-- Data Table Container -->
<div class="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant">
<table class="w-full border-collapse">
<thead>
<tr class="bg-secondary-container text-on-secondary-container">
<th class="font-table-header text-table-header px-4 py-4 text-left uppercase tracking-wider">No. FPPK</th>
<th class="font-table-header text-table-header px-4 py-4 text-left uppercase tracking-wider">Job Post Title</th>
<th class="font-table-header text-table-header px-4 py-4 text-left uppercase tracking-wider">Job Category</th>
<th class="font-table-header text-table-header px-4 py-4 text-left uppercase tracking-wider">Job Field</th>
<th class="font-table-header text-table-header px-4 py-4 text-left uppercase tracking-wider">Posted Date</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant">
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="px-4 py-row-padding font-body-md">FPPK/2024/001</td>
<td class="px-4 py-row-padding font-body-md font-semibold text-primary">Senior Software Engineer</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Permanent</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Information Technology</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">12 Oct 2024</td>
</tr>
<tr class="bg-surface-container-low hover:bg-surface-container-low transition-colors group">
<td class="px-4 py-row-padding font-body-md">FPPK/2024/002</td>
<td class="px-4 py-row-padding font-body-md font-semibold text-primary">HR Business Partner</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Permanent</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Human Resources</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">14 Oct 2024</td>
</tr>
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="px-4 py-row-padding font-body-md">FPPK/2024/003</td>
<td class="px-4 py-row-padding font-body-md font-semibold text-primary">Graphic Designer Intern</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Internship</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Creative Design</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">15 Oct 2024</td>
</tr>
<tr class="bg-surface-container-low hover:bg-surface-container-low transition-colors group">
<td class="px-4 py-row-padding font-body-md">FPPK/2024/004</td>
<td class="px-4 py-row-padding font-body-md font-semibold text-primary">Marketing Strategist</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Contract</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Marketing</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">16 Oct 2024</td>
</tr>
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="px-4 py-row-padding font-body-md">FPPK/2024/005</td>
<td class="px-4 py-row-padding font-body-md font-semibold text-primary">Financial Analyst</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Permanent</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Finance</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">18 Oct 2024</td>
</tr>
<tr class="bg-surface-container-low hover:bg-surface-container-low transition-colors group">
<td class="px-4 py-row-padding font-body-md">FPPK/2024/006</td>
<td class="px-4 py-row-padding font-body-md font-semibold text-primary">Admin Support Executive</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">Permanent</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">General Affairs</td>
<td class="px-4 py-row-padding font-body-md text-on-surface-variant">20 Oct 2024</td>
</tr>
</tbody>
</table>
</div>
</main>
<!-- Footer -->
<footer class="bg-surface-container-lowest dark:bg-surface-dim text-on-surface-variant dark:text-on-surface font-body-sm text-body-sm full-width bottom-0 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-container-margin py-section-gap transition-colors duration-150">
<div class="flex flex-col items-center md:items-start gap-2">
<div class="flex items-center gap-2">
<span class="text-on-surface-variant">Powered By :</span>
<span class="font-label-md text-label-md font-bold text-primary">ACC Red Berries</span>
</div>
<p>© 2024 Berijalan Recruitment Management System. All rights reserved.</p>
</div>
<div class="flex gap-6 mt-4 md:mt-0">
<a class="text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
<a class="text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
<a class="text-on-surface-variant hover:text-secondary transition-colors" href="#">Contact Support</a>
</div>
</footer>
</body></html>


yang ke 2 setelah di klik post a job nanti akan tampil halaman create new job posting:
disini ada beberapa tab, pertama Job Information dengan ada bebrapa field, nah semua field di halaman ini akan di jadikan parameter inputan oleh AI gemini itu untuk cv summarizer, kalau di cv summarizer projek ini sekarang kan fieldnya ada     positionName: '',
    jobDescription: '',
    minExperience: 'Fresh Graduate',
    minEducation: 'S1',
    notes: '
nah kalau sekarang tambahlah dengan field2 itu, pada field di application & screening process buatlah input field semua, saja, jadi value/constraintnya user nya biar mengetik saja, kemudian untuk tab lain seperti recruitment process, SEO configuration, dan Preview & Publish anda disable saja, itu karena saya hanya ingin menyamakan tampilan dengan web career acc nya, kemudian untuk memposting job menggunakan button create new Post yang akan di tampilkan pada Job Posting Management tadi untuk bisa di edit ataupun di hapus melalui situ (CRUD):

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed-variant": "#004880",
                        "on-secondary-container": "#693600",
                        "background": "#f8f9fa",
                        "outline-variant": "#c1c7d2",
                        "surface-tint": "#1961a1",
                        "primary-container": "#005696",
                        "on-tertiary-fixed": "#151d20",
                        "tertiary-fixed": "#dce3e8",
                        "inverse-surface": "#2e3132",
                        "on-tertiary-container": "#c2c9ce",
                        "tertiary": "#373e42",
                        "on-secondary-fixed-variant": "#6d3900",
                        "secondary-fixed": "#ffdcc2",
                        "inverse-on-surface": "#f0f1f2",
                        "on-primary-container": "#a5cbff",
                        "on-error": "#ffffff",
                        "secondary": "#904d00",
                        "error": "#ba1a1a",
                        "tertiary-fixed-dim": "#c0c7cc",
                        "surface-container-lowest": "#ffffff",
                        "outline": "#727781",
                        "on-tertiary-fixed-variant": "#41484c",
                        "on-secondary-fixed": "#2e1500",
                        "surface-container-low": "#f3f4f5",
                        "on-primary-fixed": "#001c37",
                        "surface-dim": "#d9dadb",
                        "inverse-primary": "#a1c9ff",
                        "primary-fixed": "#d2e4ff",
                        "tertiary-container": "#4e5559",
                        "surface-container-high": "#e7e8e9",
                        "on-surface": "#191c1d",
                        "on-primary": "#ffffff",
                        "on-error-container": "#93000a",
                        "on-background": "#191c1d",
                        "on-secondary": "#ffffff",
                        "surface-container-highest": "#e1e3e4",
                        "primary": "#003e6f",
                        "surface-container": "#edeeef",
                        "secondary-container": "#fe9835",
                        "surface": "#f8f9fa",
                        "surface-bright": "#f8f9fa",
                        "primary-fixed-dim": "#a1c9ff",
                        "on-tertiary": "#ffffff"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "section-gap": "32px",
                        "gutter": "16px",
                        "container-margin": "24px",
                        "unit": "4px",
                        "row-padding": "12px 16px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Inter"],
                        "headline-md": ["Inter"],
                        "body-sm": ["Inter"],
                        "label-md": ["Inter"],
                        "headline-xl": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "table-header": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                        "headline-md": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}],
                        "body-sm": ["12px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "label-md": ["13px", {"lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "600"}],
                        "headline-xl": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
                        "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "body-lg": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "table-header": ["14px", {"lineHeight": "1.2", "fontWeight": "600"}]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .step-active {
            @apply border-l-4 border-secondary-container bg-primary-fixed/30 text-on-primary-fixed;
        }
        .rich-text-toolbar {
            @apply flex items-center gap-2 p-2 border-b border-outline-variant bg-surface-container-low;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
<!-- Top Navigation Shell -->
<nav class="flex justify-between items-center w-full px-container-margin py-4 bg-primary dark:bg-primary-container sticky top-0 z-50">
<div class="flex items-center gap-8">
<span class="font-headline-lg text-headline-lg font-bold text-on-primary dark:text-on-primary-container">Berijalan</span>
<div class="hidden md:flex gap-6">
<a class="text-on-primary/80 hover:text-on-primary transition-colors font-body-md text-body-md" href="#">Job Posting</a>
<a class="text-on-primary border-b-2 border-secondary-container pb-1 font-bold font-body-md text-body-md" href="#">Job Listing</a>
</div>
</div>
<button class="bg-secondary-container text-on-secondary-container px-6 py-2 font-bold transition-all duration-200 active:opacity-90 font-label-md text-label-md">
            Post a Job
        </button>
</nav>
<!-- Hero Banner for Header Section -->
<header class="bg-primary-container text-on-primary-container px-container-margin py-10">
<div class="max-w-7xl mx-auto">
<h1 class="font-headline-xl text-headline-xl mb-2">Create New Job Posting</h1>
<p class="font-body-lg text-body-lg text-on-primary-container/80">Design and publish your recruitment requirements with precision.</p>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow max-w-7xl mx-auto w-full px-container-margin -mt-8 mb-12">
<div class="flex flex-col md:flex-row gap-gutter">
<!-- Side Navigation Wizard -->
<aside class="w-full md:w-80 shrink-0">
<div class="bg-surface-container-lowest border border-outline-variant rounded shadow-sm sticky top-24">
<div class="p-4 border-b border-outline-variant">
<h3 class="font-label-md text-label-md text-primary uppercase tracking-wider">Wizard Progress</h3>
</div>
<nav class="flex flex-col">
<div class="flex items-center gap-4 px-4 py-4 border-l-4 border-secondary-container bg-primary/5 text-primary">
<span class="material-symbols-outlined" data-icon="info">info</span>
<span class="font-headline-md text-headline-md">Job Information</span>
</div>
<div class="flex items-center gap-4 px-4 py-4 border-l-4 border-transparent text-on-surface-variant hover:bg-surface-container-low transition-colors">
<span class="material-symbols-outlined" data-icon="assignment_turned_in">assignment_turned_in</span>
<span class="font-headline-md text-headline-md">Application &amp; Screening</span>
</div>
<div class="flex items-center gap-4 px-4 py-4 border-l-4 border-transparent text-on-surface-variant opacity-50 cursor-not-allowed">
<span class="material-symbols-outlined" data-icon="settings_accessibility">settings_accessibility</span>
<span class="font-headline-md text-headline-md">Recruitment Process</span>
</div>
<div class="flex items-center gap-4 px-4 py-4 border-l-4 border-transparent text-on-surface-variant opacity-50 cursor-not-allowed">
<span class="material-symbols-outlined" data-icon="search">search</span>
<span class="font-headline-md text-headline-md">SEO Configuration</span>
</div>
<div class="flex items-center gap-4 px-4 py-4 border-l-4 border-transparent text-on-surface-variant opacity-50 cursor-not-allowed">
<span class="material-symbols-outlined" data-icon="visibility">visibility</span>
<span class="font-headline-md text-headline-md">Preview &amp; Publish</span>
</div>
</nav>
</div>
<div class="mt-gutter rounded overflow-hidden">
<img alt="" class="w-full h-48 object-cover" data-alt="A clean, professional corporate office background with soft bokeh. The scene shows a modern minimalist recruitment workstation with a high-end laptop and architectural blueprints, reflecting a focused and productive talent management atmosphere. The lighting is bright and natural, maintaining the Berijalan light-mode aesthetic." src="https://lh3.googleusercontent.com/aida/ADBb0uidl3G_jLvUztGzQwRHZ_zm6z7W_o5GPgz35cVYDU51L0Ee-bgvnmqwhlPmznvOj8y6nWgum22G-tZHgk2Bf5SKDWlk7wXORYjDGWqBhZQXcR2JNJt4BMyZarMmPG__QGjJkQWlTaprdjSNUUlcHsKdf4h9LOAi73Y-fJl58nBUkHHyvos5z5dmVN8B37vGFb2MxzQ4d3oNGCWkkFSDmJsAgv2R5GNuS5DZqEFsEUVPtkpArE6zXUWA1Me82lzWvZFAR0F-zNCCaSk"/>
</div>
</aside>
<!-- Form Content -->
<div class="flex-grow space-y-gutter">
<!-- Section 1: Job Information -->
<section class="bg-surface-container-lowest border border-outline-variant shadow-sm rounded">
<div class="bg-secondary-container px-6 py-3">
<h2 class="font-headline-md text-headline-md text-on-secondary-container uppercase">1. Job Information</h2>
</div>
<div class="p-6 space-y-6">
<!-- FPPK Search -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="flex flex-col gap-2">
<label class="font-label-md text-label-md text-on-surface-variant">No. FPPK</label>
<div class="relative">
<input class="w-full border border-outline px-4 py-3 pr-12 focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="Search FPPK Number..." type="text"/>
<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
</div>
</div>
<div class="flex flex-col gap-2">
<label class="font-label-md text-label-md text-on-surface-variant">Job Position</label>
<input class="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="Enter position name" type="text"/>
</div>
</div>
<!-- Titles -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="flex flex-col gap-2">
<label class="font-label-md text-label-md text-on-surface-variant">Job Post Title</label>
<input class="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" type="text"/>
</div>
<div class="flex flex-col gap-2">
<label class="font-label-md text-label-md text-on-surface-variant">Job Post Subtitle</label>
<input class="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" type="text"/>
</div>
</div>
<!-- Rich Text Editor: Description -->
<div class="flex flex-col gap-2">
<label class="font-label-md text-label-md text-on-surface-variant">Job Post Description</label>
<div class="border border-outline">
<div class="rich-text-toolbar">
<button class="p-1 hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant" data-icon="format_bold">format_bold</span></button>
<button class="p-1 hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant" data-icon="format_italic">format_italic</span></button>
<button class="p-1 hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant" data-icon="format_list_bulleted">format_list_bulleted</span></button>
<button class="p-1 hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant" data-icon="link">link</span></button>
</div>
<textarea class="w-full border-none px-4 py-3 focus:ring-0 resize-none font-body-md text-body-md" placeholder="Enter detailed job responsibilities..." rows="4"></textarea>
</div>
</div>
<!-- Rich Text Editor: Qualifications -->
<div class="flex flex-col gap-2">
<label class="font-label-md text-label-md text-on-surface-variant">Qualification Description</label>
<div class="border border-outline">
<div class="rich-text-toolbar">
<button class="p-1 hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant" data-icon="format_bold">format_bold</span></button>
<button class="p-1 hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant" data-icon="format_italic">format_italic</span></button>
<button class="p-1 hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant" data-icon="format_list_numbered">format_list_numbered</span></button>
</div>
<textarea class="w-full border-none px-4 py-3 focus:ring-0 resize-none font-body-md text-body-md" placeholder="List required skills and education..." rows="4"></textarea>
</div>
</div>
</div>
</section>
<!-- Section 2: Application & Screening Process -->
<section class="bg-surface-container-lowest border border-outline-variant shadow-sm rounded">
<div class="bg-primary-container px-6 py-3">
<h2 class="font-headline-md text-headline-md text-on-primary-container uppercase">2. Application &amp; Screening Process</h2>
</div>
<div class="p-6">
<div class="flex items-center justify-between mb-6">
<h3 class="font-headline-md text-headline-md text-primary">Preferred Qualifications</h3>
<button class="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-label-md text-label-md">
<span class="material-symbols-outlined" data-icon="add_circle">add_circle</span>
                                Add Requirement
                            </button>
</div>
<div class="overflow-x-auto">
<table class="w-full border-collapse">
<thead class="bg-secondary-container text-on-secondary-container">
<tr>
<th class="px-4 py-3 text-left font-table-header text-table-header uppercase tracking-wider">Requirement Field</th>
<th class="px-4 py-3 text-left font-table-header text-table-header uppercase tracking-wider">Mandatory</th>
<th class="px-4 py-3 text-left font-table-header text-table-header uppercase tracking-wider">Value/Constraint</th>
<th class="px-4 py-3 text-right font-table-header text-table-header uppercase tracking-wider">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant">
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">Age</td>
<td class="px-4 py-3">
<input checked="" class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<input class="border border-outline px-2 py-1 text-sm w-full" type="text" value="Max 35 Years"/>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr>
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">Minimum Degree</td>
<td class="px-4 py-3">
<input checked="" class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<select class="border border-outline px-2 py-1 text-sm w-full bg-white">
<option>Bachelor (S1)</option>
<option>Master (S2)</option>
</select>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr>
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">GPA Minimum</td>
<td class="px-4 py-3">
<input checked="" class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<input class="border border-outline px-2 py-1 text-sm w-full" type="text" value="3.00"/>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr>
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">University</td>
<td class="px-4 py-3">
<input class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<input class="border border-outline px-2 py-1 text-sm w-full" placeholder="Specific University..." type="text"/>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr>
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">Major</td>
<td class="px-4 py-3">
<input checked="" class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<input class="border border-outline px-2 py-1 text-sm w-full" type="text" value="IT, Business, Engineering"/>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr>
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">Home Address</td>
<td class="px-4 py-3">
<input class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<input class="border border-outline px-2 py-1 text-sm w-full" placeholder="Area restriction..." type="text"/>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr>
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">Job Field</td>
<td class="px-4 py-3">
<input checked="" class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<input class="border border-outline px-2 py-1 text-sm w-full" type="text" value="Information Technology"/>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr>
<tr class="hover:bg-primary-fixed-dim/10 transition-colors">
<td class="px-4 py-3 font-body-md text-body-md font-semibold text-primary">Additional Qualification</td>
<td class="px-4 py-3">
<input class="rounded text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-4 py-3">
<input class="border border-outline px-2 py-1 text-sm w-full" placeholder="Enter additional criteria for AI analysis" type="text"/>
</td>
<td class="px-4 py-3 text-right">
<button class="text-error hover:text-red-700"><span class="material-symbols-outlined" data-icon="delete">delete</span></button>
</td>
</tr></tbody>
</table>
</div>
</div>
</section>
<!-- Action Footer for Card -->
<div class="flex justify-end items-center gap-4 py-6 border-t border-outline-variant">
<button class="px-8 py-3 border border-primary text-primary font-bold hover:bg-primary-fixed-dim/10 transition-all duration-150 font-label-md text-label-md">
                        Save as Draft
                    </button>
<button class="px-8 py-3 bg-secondary-container text-on-secondary-container font-bold transition-all duration-200 active:opacity-90 font-label-md text-label-md">
                        Create New Post
                    </button>
</div>
</div>
</div>
</main>
<!-- Global Footer -->
<footer class="flex flex-col md:flex-row justify-between items-center w-full px-container-margin py-section-gap bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant">
<div class="mb-4 md:mb-0">
<span class="font-label-md text-label-md font-bold text-primary">Berijalan</span>
<p class="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface">© 2024 Berijalan Recruitment Management System. All rights reserved.</p>
</div>
<div class="flex gap-6">
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Privacy Policy</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Terms of Service</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Contact Support</a>
</div>
</footer>
</body></html>


nah kemudian setelah di klik create new post akan masuk ke halaman Job Listing, di sini itu akan tampil juga job2 yang telah di creaete, namun di halaman ini sebenearnya fungsinya untuk memproses kandidat bukan untuk CRUD job post, di sini bisa di klik nanti job nya:

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#191c1d",
                        "secondary": "#904d00",
                        "on-tertiary-fixed": "#151d20",
                        "on-primary-fixed-variant": "#004880",
                        "primary-fixed-dim": "#a1c9ff",
                        "on-primary-fixed": "#001c37",
                        "on-primary-container": "#a5cbff",
                        "surface-dim": "#d9dadb",
                        "tertiary": "#373e42",
                        "surface-container-lowest": "#ffffff",
                        "on-secondary-fixed": "#2e1500",
                        "error": "#ba1a1a",
                        "tertiary-container": "#4e5559",
                        "surface-tint": "#1961a1",
                        "primary": "#003e6f",
                        "inverse-primary": "#a1c9ff",
                        "surface-variant": "#e1e3e4",
                        "background": "#f8f9fa",
                        "inverse-on-surface": "#f0f1f2",
                        "surface-container-highest": "#e1e3e4",
                        "surface": "#f8f9fa",
                        "outline-variant": "#c1c7d2",
                        "on-secondary-fixed-variant": "#6d3900",
                        "primary-fixed": "#d2e4ff",
                        "secondary-container": "#fe9835",
                        "surface-container-low": "#f3f4f5",
                        "on-error": "#ffffff",
                        "on-surface-variant": "#414750",
                        "surface-container": "#edeeef",
                        "surface-bright": "#f8f9fa",
                        "on-tertiary-fixed-variant": "#41484c",
                        "on-error-container": "#93000a",
                        "on-secondary": "#ffffff",
                        "inverse-surface": "#2e3132",
                        "on-tertiary": "#ffffff",
                        "outline": "#727781",
                        "secondary-fixed-dim": "#ffb77c",
                        "surface-container-high": "#e7e8e9",
                        "primary-container": "#005696",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#693600",
                        "tertiary-fixed": "#dce3e8",
                        "secondary-fixed": "#ffdcc2",
                        "on-primary": "#ffffff",
                        "on-tertiary-container": "#c2c9ce",
                        "tertiary-fixed-dim": "#c0c7cc",
                        "on-background": "#191c1d"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "container-margin": "24px",
                        "gutter": "16px",
                        "unit": "4px",
                        "section-gap": "32px",
                        "row-padding": "12px 16px"
                    },
                    "fontFamily": {
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-md": ["Inter"],
                        "headline-xl": ["Inter"],
                        "body-sm": ["Inter"],
                        "table-header": ["Inter"],
                        "headline-lg": ["Inter"]
                    },
                    "fontSize": {
                        "label-md": ["13px", {"lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "600"}],
                        "body-lg": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "headline-md": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}],
                        "headline-xl": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
                        "body-sm": ["12px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "table-header": ["14px", {"lineHeight": "1.2", "fontWeight": "600"}],
                        "headline-lg": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-background text-on-surface flex flex-col min-h-screen">
<!-- TopNavBar Component -->
<header class="bg-primary dark:bg-primary-container flex justify-between items-center w-full px-container-margin py-4 top-0 z-50">
<div class="flex items-center gap-8">
<span class="font-headline-lg text-headline-lg font-bold text-on-primary dark:text-on-primary-container">Berijalan</span>
<nav class="hidden md:flex items-center gap-6">
<a class="text-on-primary/80 hover:text-on-primary transition-colors font-headline-md text-headline-md transition-all duration-200 active:opacity-90" href="#">Job Posting</a>
<a class="text-on-primary border-b-2 border-secondary-container pb-1 font-bold font-headline-md text-headline-md transition-all duration-200 active:opacity-90" href="#">Job Listing</a>
</nav>
</div>
<button class="bg-secondary-container text-on-secondary-container px-6 py-2 font-bold transition-all duration-200 active:opacity-90 hover:brightness-110">
            Post a Job
        </button>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow w-full max-w-7xl mx-auto px-container-margin py-section-gap">
<!-- Page Header Section -->
<div class="mb-section-gap flex flex-col md:flex-row md:items-end justify-between border-l-4 border-secondary-container pl-4">
<div>
<h1 class="font-headline-xl text-headline-xl text-primary mb-2">Application Tracking System</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Manage and track active recruitment cycles across all departments.</p>
</div>
<div class="flex gap-2 mt-4 md:mt-0">
<button class="flex items-center gap-2 border border-outline px-4 py-2 text-primary font-bold hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-base">export_notes</span>
<span class="font-label-md text-label-md">Export Data</span>
</button>
</div>
</div>
<!-- Job Listing Grid -->
<div class="grid grid-cols-1 gap-6">
<!-- Job Card 1 -->
<div class="bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 group overflow-hidden">
<div class="flex flex-col md:flex-row">
<div class="w-full md:w-48 h-48 md:h-auto overflow-hidden bg-surface-container">
<img alt="Job Image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A professional corporate office setting with clean, minimalist desks and glass partitions. The lighting is soft and natural, emphasizing a bright, productive light-mode workspace. The color palette features soft whites, primary blues, and warm wood tones, creating an atmosphere of institutional trust and modern efficiency." src="https://lh3.googleusercontent.com/aida/ADBb0uj1rNaFEc3tx-42d86IC-EQPMXJPu7mJU6DT0uobt6IbgEWebIFZLXWB5LIlk31lYl34Bjd01WWtUUJleXP15J3PsC07tQdo_rTg1ltZ99pXA1ssCG5sm6kuWSDENHMz1i4XjHtXb0ZZ9ttU0UUSFXwme4HlRDeazQNrHaksKVnKnhFaQtRDhADGyU7UqW_lZzae8oWGJwMimWJVdLAx3LJXRomrvEqGH6-osVPiTG9a3GzJHYHJcxsdxvJ-Xof4i2R9SV4Pc7GEg"/>
</div>
<div class="flex-grow p-6">
<div class="flex flex-wrap items-center justify-between gap-4 mb-4">
<div>
<span class="font-label-md text-label-md text-secondary uppercase tracking-wider mb-1 block">Human Capital</span>
<h3 class="font-headline-lg text-headline-lg text-primary">Senior Recruitment Specialist</h3>
<div class="flex items-center gap-4 mt-2 text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm">location_on</span>
<span class="font-body-sm text-body-sm">Jakarta, Indonesia</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm">schedule</span>
<span class="font-body-sm text-body-sm">Full-time</span>
</div>
</div>
</div>
<div class="flex flex-wrap gap-2">
<span class="bg-secondary-container text-on-secondary-container px-3 py-1 font-label-md text-label-md rounded-full">12 Unread</span>
<span class="bg-primary-container text-on-primary-container px-3 py-1 font-label-md text-label-md rounded-full">45 Shortlist</span>
<span class="bg-tertiary-container text-on-tertiary-container px-3 py-1 font-label-md text-label-md rounded-full">On-going Recruitment</span>
</div>
</div>
<div class="border-t border-outline-variant pt-4 flex justify-end gap-3">
<button class="text-primary font-bold px-4 py-2 hover:bg-primary/5 transition-colors font-label-md text-label-md">View Details</button>
<button class="bg-primary text-on-primary px-6 py-2 font-bold hover:brightness-110 transition-all font-label-md text-label-md">Manage Candidates</button>
</div>
</div>
</div>
</div>
<!-- Job Card 2 -->
<div class="bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 group overflow-hidden">
<div class="flex flex-col md:flex-row">
<div class="w-full md:w-48 h-48 md:h-auto overflow-hidden bg-surface-container">
<img alt="Job Image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A focused close-up of a high-end laptop display showing recruitment data visualizations and applicant lists. The background is a softly blurred modern office interior with primary blue and clean white accents. The mood is professional and data-driven, highlighting clarity and corporate reliability in recruitment management." src="https://lh3.googleusercontent.com/aida/ADBb0ugDiv1KfLgLKjS0VZHn8ZoiDSyz7Ux4_jI7GAP4yMjtVPqJ6p60DVFgKSVh6rKU4jzWHyy6jvlvAFslX0-ZcMhuGX9u3Nsf15npKuMra7hhIccy2I2Dhpg_ZqzthRTn9RnXYqrjr9JY65bQyfiszwVQEnYp0f1Z6hUSBAVtIvhJU-QcwPwH10GXBe90lQFfCiwHKFnGlqCe3IXbY-nJ_q_Nz3qiHA7qk-Hg4s-SAmkWsg1hse0Ibq3Hh4JpfEMjWv5_p96nBRUlpA"/>
</div>
<div class="flex-grow p-6">
<div class="flex flex-wrap items-center justify-between gap-4 mb-4">
<div>
<span class="font-label-md text-label-md text-secondary uppercase tracking-wider mb-1 block">Information Technology</span>
<h3 class="font-headline-lg text-headline-lg text-primary">Full Stack Developer - Internship</h3>
<div class="flex items-center gap-4 mt-2 text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm">location_on</span>
<span class="font-body-sm text-body-sm">Remote</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm">school</span>
<span class="font-body-sm text-body-sm">Internship</span>
</div>
</div>
</div>
<div class="flex flex-wrap gap-2">
<span class="bg-surface-container-highest text-on-surface-variant px-3 py-1 font-label-md text-label-md rounded-full">0 Unread</span>
<span class="bg-primary-container text-on-primary-container px-3 py-1 font-label-md text-label-md rounded-full">8 Shortlist</span>
<span class="bg-green-600 text-white px-3 py-1 font-label-md text-label-md rounded-full">Hired</span>
</div>
</div>
<div class="border-t border-outline-variant pt-4 flex justify-end gap-3">
<button class="text-primary font-bold px-4 py-2 hover:bg-primary/5 transition-colors font-label-md text-label-md">View Details</button>
<button class="bg-primary text-on-primary px-6 py-2 font-bold hover:brightness-110 transition-all font-label-md text-label-md">Manage Candidates</button>
</div>
</div>
</div>
</div>
<!-- Job Card 3 -->
<div class="bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 group overflow-hidden">
<div class="flex flex-col md:flex-row">
<div class="w-full md:w-48 h-48 md:h-auto overflow-hidden bg-surface-container">
<img alt="Job Image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A collaborative meeting space with modern ergonomic chairs around a sleek conference table. The scene is illuminated by daylight from large windows, reflecting a bright and open corporate culture. The visual style is rooted in professional efficiency, using a palette of crisp whites and corporate blues with orange accents." src="https://lh3.googleusercontent.com/aida/ADBb0uidl3G_jLvUztGzQwRHZ_zm6z7W_o5GPgz35cVYDU51L0Ee-bgvnmqwhlPmznvOj8y6nWgum22G-tZHgk2Bf5SKDWlk7wXORYjDGWqBhZQXcR2JNJt4BMyZarMmPG__QGjJkQWlTaprdjSNUUlcHsKdf4h9LOAi73Y-fJl58nBUkHHyvos5z5dmVN8B37vGFb2MxzQ4d3oNGCWkkFSDmJsAgv2R5GNuS5DZqEFsEUVPtkpArE6zXUWA1Me82lzWvZFAR0F-zNCCaSk"/>
</div>
<div class="flex-grow p-6">
<div class="flex flex-wrap items-center justify-between gap-4 mb-4">
<div>
<span class="font-label-md text-label-md text-secondary uppercase tracking-wider mb-1 block">General Affairs</span>
<h3 class="font-headline-lg text-headline-lg text-primary">Office Administration Lead</h3>
<div class="flex items-center gap-4 mt-2 text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm">location_on</span>
<span class="font-body-sm text-body-sm">Surabaya, Indonesia</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm">schedule</span>
<span class="font-body-sm text-body-sm">Full-time</span>
</div>
</div>
</div>
<div class="flex flex-wrap gap-2">
<span class="bg-surface-variant text-on-surface-variant px-3 py-1 font-label-md text-label-md rounded-full">Archived</span>
</div>
</div>
<div class="border-t border-outline-variant pt-4 flex justify-end gap-3">
<button class="text-primary font-bold px-4 py-2 hover:bg-primary/5 transition-colors font-label-md text-label-md">View Details</button>
<button class="bg-surface-container text-on-surface-variant px-6 py-2 font-bold cursor-not-allowed font-label-md text-label-md">Closed</button>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Footer Component -->
<footer class="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-container-margin py-section-gap mt-auto">
<div class="mb-4 md:mb-0">
<span class="font-label-md text-label-md font-bold text-primary">Berijalan Recruitment</span>
<p class="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface mt-1">© 2024 Berijalan Recruitment Management System. All rights reserved.</p>
</div>
<div class="flex gap-6">
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Privacy Policy</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Terms of Service</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Contact Support</a>
</div>
</footer>
</body></html>

nah trakhir adalah detail job listing, apabila job nya di klik nanti akan masuk ke detail kandidat yang apply, jadi disini ada button upload cv, nanti itu ketika di klik akan berguna untuk upload cv candidate dimana itu adalah trigger dari AI nya untuk generate summarizer berdasarkan Parameter inputan dari job yang di post tadi, dari menu Create New Job Posting, dan di detail job listing ini ada tabel dimana tabel ini memunculkan beberapa kolom dari hasil generate summarizer juga, seperti ai matching score itu dan lain2, dan nama candidate nya dapat di klik untuk melihat detail AI SUmmarizer per kandidat

<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Candidate Management - Berijalan</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
            "secondary-fixed": "#ffdcc2",
            "on-tertiary": "#ffffff",
            "on-background": "#191c1d",
            "tertiary": "#373e42",
            "primary": "#003e6f",
            "on-secondary": "#ffffff",
            "outline": "#727781",
            "on-error": "#ffffff",
            "primary-fixed-dim": "#a1c9ff",
            "on-primary": "#ffffff",
            "surface-variant": "#e1e3e4",
            "outline-variant": "#c1c7d2",
            "on-primary-fixed-variant": "#004880",
            "on-primary-container": "#a5cbff",
            "inverse-surface": "#2e3132",
            "background": "#f8f9fa",
            "tertiary-container": "#4e5559",
            "primary-container": "#005696",
            "surface-container-highest": "#e1e3e4",
            "on-secondary-fixed-variant": "#6d3900",
            "on-primary-fixed": "#001c37",
            "inverse-primary": "#a1c9ff",
            "surface": "#f8f9fa",
            "secondary": "#904d00",
            "tertiary-fixed-dim": "#c0c7cc",
            "secondary-fixed-dim": "#ffb77c",
            "error": "#ba1a1a",
            "surface-tint": "#1961a1",
            "surface-container-lowest": "#ffffff",
            "on-surface": "#191c1d",
            "surface-bright": "#f8f9fa",
            "secondary-container": "#fe9835",
            "on-error-container": "#93000a",
            "inverse-on-surface": "#f0f1f2",
            "on-tertiary-container": "#c2c9ce",
            "on-secondary-fixed": "#2e1500",
            "on-tertiary-fixed-variant": "#41484c",
            "on-surface-variant": "#414750",
            "surface-container-low": "#f3f4f5",
            "surface-container": "#edeeef",
            "error-container": "#ffdad6",
            "surface-dim": "#d9dadb",
            "on-tertiary-fixed": "#151d20",
            "tertiary-fixed": "#dce3e8",
            "primary-fixed": "#d2e4ff",
            "surface-container-high": "#e7e8e9",
            "on-secondary-container": "#693600"
          },
          "borderRadius": {
            "DEFAULT": "0.125rem",
            "lg": "0.25rem",
            "xl": "0.5rem",
            "full": "0.75rem"
          },
          "spacing": {
            "section-gap": "32px",
            "row-padding": "12px 16px",
            "container-margin": "24px",
            "unit": "4px",
            "gutter": "16px"
          },
          "fontFamily": {
            "headline-xl": ["Inter"],
            "label-md": ["Inter"],
            "headline-md": ["Inter"],
            "headline-lg": ["Inter"],
            "body-sm": ["Inter"],
            "body-md": ["Inter"],
            "body-lg": ["Inter"],
            "table-header": ["Inter"]
          },
          "fontSize": {
            "headline-xl": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
            "label-md": ["13px", {"lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "600"}],
            "headline-md": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}],
            "headline-lg": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
            "body-sm": ["12px", {"lineHeight": "1.5", "fontWeight": "400"}],
            "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
            "body-lg": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
            "table-header": ["14px", {"lineHeight": "1.2", "fontWeight": "600"}]
          }
        },
      },
    }
  </script>
<style>
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    body {
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body class="bg-surface text-on-surface flex flex-col min-h-screen">
<!-- TopNavBar Component -->
<header class="bg-primary dark:bg-primary-container flex justify-between items-center w-full px-container-margin py-4 top-0 sticky z-50">
<div class="flex items-center gap-gutter">
<span class="font-headline-lg text-headline-lg font-bold text-on-primary dark:text-on-primary-container">Berijalan</span>
<nav class="hidden md:flex items-center gap-6 ml-8">
<a class="text-on-primary/80 hover:text-on-primary transition-colors font-body-md text-body-md" href="#">Job Posting</a>
<a class="text-on-primary border-b-2 border-secondary-container pb-1 font-bold font-body-md text-body-md" href="#">Job Listing</a>
</nav>
</div>
<div class="flex items-center gap-gutter">
<button class="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-lg font-label-md text-label-md font-bold transition-all duration-200 active:opacity-90 hover:bg-primary-fixed-dim/10">
        Post a Job
      </button>
<div class="w-10 h-10 rounded-full overflow-hidden bg-outline-variant border-2 border-on-primary/20">
<img class="w-full h-full object-cover" data-alt="A professional headshot of a recruitment manager in a bright corporate office setting, captured with soft, natural daylight. The manager has a warm, confident expression, wearing a tailored navy blazer. The background is a clean, modern workspace with blurred architectural elements and a light-mode color palette of whites and soft greys." src="https://lh3.googleusercontent.com/aida/ADBb0uidl3G_jLvUztGzQwRHZ_zm6z7W_o5GPgz35cVYDU51L0Ee-bgvnmqwhlPmznvOj8y6nWgum22G-tZHgk2Bf5SKDWlk7wXORYjDGWqBhZQXcR2JNJt4BMyZarMmPG__QGjJkQWlTaprdjSNUUlcHsKdf4h9LOAi73Y-fJl58nBUkHHyvos5z5dmVN8B37vGFb2MxzQ4d3oNGCWkkFSDmJsAgv2R5GNuS5DZqEFsEUVPtkpArE6zXUWA1Me82lzWvZFAR0F-zNCCaSk"/>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow w-full max-w-7xl mx-auto px-container-margin py-section-gap">
<!-- Page Header Section -->
<div class="flex flex-col md:flex-row md:items-end justify-between mb-section-gap gap-gutter">
<div>
<h1 class="font-headline-xl text-headline-xl text-primary mb-1">Candidate Management</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-2">
<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">work</span>
          Senior Software Engineer
        </p>
</div>
<button class="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-8 py-3 rounded-xl font-headline-md text-headline-md transition-all duration-200 active:opacity-90">
<span class="material-symbols-outlined">upload_file</span>
        Upload CV
      </button>
</div>
<!-- Stats Overview (Asymmetric Layout Element) -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-section-gap">
<div class="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant/30 flex flex-col">
<span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Total Candidates</span>
<span class="font-headline-lg text-headline-lg text-primary">1,284</span>
</div>
<div class="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant/30 flex flex-col">
<span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Shortlisted</span>
<span class="font-headline-lg text-headline-lg text-secondary">156</span>
</div>
<div class="md:col-span-2 bg-primary-container text-on-primary-container p-gutter rounded-xl flex items-center justify-between relative overflow-hidden">
<div class="relative z-10">
<span class="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider mb-2 block">AI Talent Sourcing</span>
<p class="font-body-md text-body-md max-w-xs">Optimizing your talent pipeline with predictive matching scores based on job requirements.</p>
</div>
<span class="material-symbols-outlined text-8xl opacity-10 absolute -right-4 -bottom-4" style="font-variation-settings: 'FILL' 1;">psychology</span>
</div>
</div>
<!-- Candidate Table Container -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-secondary-container">
<th class="px-gutter py-4 font-table-header text-table-header text-on-secondary-container uppercase tracking-wider border-r border-on-secondary-container/10">Candidate Name</th>
<th class="px-gutter py-4 font-table-header text-table-header text-on-secondary-container uppercase tracking-wider border-r border-on-secondary-container/10">Education</th>
<th class="px-gutter py-4 font-table-header text-table-header text-on-secondary-container uppercase tracking-wider border-r border-on-secondary-container/10">Major</th>
<th class="px-gutter py-4 font-table-header text-table-header text-on-secondary-container uppercase tracking-wider border-r border-on-secondary-container/10">AI Matching Score</th>
<th class="px-gutter py-4 font-table-header text-table-header text-on-secondary-container uppercase tracking-wider border-r border-on-secondary-container/10">Applied Date</th>
<th class="px-gutter py-4 font-table-header text-table-header text-on-secondary-container uppercase tracking-wider">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/20">
<!-- Row 1 -->
<tr class="hover:bg-primary-fixed-dim/5 transition-colors cursor-default group">
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden bg-outline-variant flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="A portrait of a young professional woman smiling warmly against a soft-focus minimalist office backdrop. The lighting is high-key and airy, emphasizing a clean, corporate aesthetic. The color palette features whites, subtle primary blues, and warm skin tones, conveying professional confidence and approachable character." src="https://lh3.googleusercontent.com/aida/ADBb0uj1rNaFEc3tx-42d86IC-EQPMXJPu7mJU6DT0uobt6IbgEWebIFZLXWB5LIlk31lYl34Bjd01WWtUUJleXP15J3PsC07tQdo_rTg1ltZ99pXA1ssCG5sm6kuWSDENHMz1i4XjHtXb0ZZ9ttU0UUSFXwme4HlRDeazQNrHaksKVnKnhFaQtRDhADGyU7UqW_lZzae8oWGJwMimWJVdLAx3LJXRomrvEqGH6-osVPiTG9a3GzJHYHJcxsdxvJ-Xof4i2R9SV4Pc7GEg"/>
</div>
<span class="font-headline-md text-headline-md text-on-surface">Adrian Wijaya</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Master's Degree</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Computer Science</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="flex-grow bg-surface-container-high h-2 rounded-full max-w-[100px] overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 94%;"></div>
</div>
<span class="font-label-md text-label-md text-secondary font-bold">94%</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Oct 24, 2023</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-2">
<button class="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="View Profile">
<span class="material-symbols-outlined">visibility</span>
</button>
<button class="p-2 hover:bg-secondary/10 rounded-lg text-secondary transition-colors" title="Download CV">
<span class="material-symbols-outlined">download</span>
</button>
</div>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-primary-fixed-dim/5 transition-colors cursor-default group">
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden bg-outline-variant flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="A sharp, professional headshot of a male candidate in a formal grey shirt, set against a blurred modern architectural background. The image has a clean, professional feel with soft, balanced lighting. The style is consistent with a modern HR platform, using a light-mode aesthetic with crisp focus and professional clarity." src="https://lh3.googleusercontent.com/aida/ADBb0ugDiv1KfLgLKjS0VZHn8ZoiDSyz7Ux4_jI7GAP4yMjtVPqJ6p60DVFgKSVh6rKU4jzWHyy6jvlvAFslX0-ZcMhuGX9u3Nsf15npKuMra7hhIccy2I2Dhpg_ZqzthRTn9RnXYqrjr9JY65bQyfiszwVQEnYp0f1Z6hUSBAVtIvhJU-QcwPwH10GXBe90lQFfCiwHKFnGlqCe3IXbY-nJ_q_Nz3qiHA7qk-Hg4s-SAmkWsg1hse0Ibq3Hh4JpfEMjWv5_p96nBRUlpA"/>
</div>
<span class="font-headline-md text-headline-md text-on-surface">Siti Aminah</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Bachelor's Degree</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Information Technology</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="flex-grow bg-surface-container-high h-2 rounded-full max-w-[100px] overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 88%;"></div>
</div>
<span class="font-label-md text-label-md text-secondary font-bold">88%</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Oct 25, 2023</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-2">
<button class="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="View Profile">
<span class="material-symbols-outlined">visibility</span>
</button>
<button class="p-2 hover:bg-secondary/10 rounded-lg text-secondary transition-colors" title="Download CV">
<span class="material-symbols-outlined">download</span>
</button>
</div>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-primary-fixed-dim/5 transition-colors cursor-default group">
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden bg-outline-variant flex-shrink-0">
<div class="w-full h-full bg-primary flex items-center justify-center text-on-primary font-bold">BP</div>
</div>
<span class="font-headline-md text-headline-md text-on-surface">Budi Pratama</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Bachelor's Degree</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Software Engineering</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="flex-grow bg-surface-container-high h-2 rounded-full max-w-[100px] overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 76%;"></div>
</div>
<span class="font-label-md text-label-md text-secondary font-bold">76%</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Oct 26, 2023</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-2">
<button class="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="View Profile">
<span class="material-symbols-outlined">visibility</span>
</button>
<button class="p-2 hover:bg-secondary/10 rounded-lg text-secondary transition-colors" title="Download CV">
<span class="material-symbols-outlined">download</span>
</button>
</div>
</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-primary-fixed-dim/5 transition-colors cursor-default group">
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden bg-outline-variant flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="A professional close-up of a candidate in business attire, looking directly at the camera with a friendly and capable demeanor. The setting is a brightly lit corporate environment with soft bokeh effects. The visual style is clean, modern, and high-quality, aligning with a premium recruiter management system interface in light mode." src="https://lh3.googleusercontent.com/aida/ADBb0uheXa2OdUpgstrft5Caa2CTl53mteyYTApNHkfBVc3FN2YeU1a3VLSJZNUDU1My16nTKL2bgcsa10Pp2Zkft8ADiSfJwIb3BEUn60n1PrCL7wzypY9i47fk23lAU4RlaTr---1QhzbsmUBzkpsg_WnOUJA6QORBstDqssMqcJH8VJPOD0nnr-h6U8jp_3HgPB3hoGLP7FAPGIySRXOST4Nr3pSqOPwfOolO5WWucrMGWqk4UNrUrSUh52lLiPYRUcd900BV9ufI6c4"/>
</div>
<span class="font-headline-md text-headline-md text-on-surface">Rina Lestari</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Master's Degree</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Data Science</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-3">
<div class="flex-grow bg-surface-container-high h-2 rounded-full max-w-[100px] overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 82%;"></div>
</div>
<span class="font-label-md text-label-md text-secondary font-bold">82%</span>
</div>
</td>
<td class="px-gutter py-4 font-body-md text-body-md text-on-surface-variant">Oct 26, 2023</td>
<td class="px-gutter py-4">
<div class="flex items-center gap-2">
<button class="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="View Profile">
<span class="material-symbols-outlined">visibility</span>
</button>
<button class="p-2 hover:bg-secondary/10 rounded-lg text-secondary transition-colors" title="Download CV">
<span class="material-symbols-outlined">download</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Footer / Pagination -->
<div class="px-gutter py-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
<span class="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 4 of 1,284 candidates</span>
<div class="flex items-center gap-1">
<button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-outline-variant/20 text-on-surface-variant">
<span class="material-symbols-outlined">chevron_left</span>
</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-label-md">1</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-outline-variant/20 text-on-surface-variant font-label-md">2</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-outline-variant/20 text-on-surface-variant font-label-md">3</button>
<button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-outline-variant/20 text-on-surface-variant">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</main>
<!-- Footer Component -->
<footer class="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-container-margin py-section-gap mt-auto">
<div class="mb-4 md:mb-0">
<span class="font-label-md text-label-md font-bold text-primary">Berijalan RMS</span>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">© 2024 Berijalan Recruitment Management System. All rights reserved.</p>
</div>
<nav class="flex gap-gutter">
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Privacy Policy</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Terms of Service</a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors duration-150" href="#">Contact Support</a>
</nav>
</footer>
</body></html>


notes: sesuaikan databasenya ya, pokoknya simpan di database, kalau menutup webnya dan membukanya lagi pastikan job nya tetap ter simpan dan tidak hilang
