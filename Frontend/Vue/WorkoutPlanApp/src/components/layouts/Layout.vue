<script setup></script>

<template>
    <header class="text-gradient"></header>
    <main>
        <slot/>
    </main>
    <footer>
        <small>Created by</small>
        <a href="https://github.com/marina04-dev" target="_blank">
            <img src="https://avatars.githubusercontent.com/u/184544008?s=400&v=4" alt="profile"/>
            <p>marina04-dev</p>
            <i class="fa-brands fa-github"></i>
        </a>
    </footer>
</template>

<style scoped>
    header, footer, main {
        padding: 1rem;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    main {
        flex: 1;
    }

    footer {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        padding: 2rem 0;
        padding-bottom: 3rem;
    }

    footer a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.3rem;
        padding-right: 0.5rem;
        background: var(--background-muted);
        border-radius: 4rem;
        border: 1px solid transparent;
        transition-duration: 200ms;
        text-decoration: none;
    }

    footer a:hover {
        border-color: var(--color-link);
    }

    footer a img {
        max-width: 30px;
        aspect-ratio: 1 / 1;
        border-radius: 100%;
    }
</style>