import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["entries", "pagination"]

    initialize() {
        let options = {
            rootMargin: '200px',
        }

        this.intersectionObserver = new IntersectionObserver(entries => this.processIntersectionEntries(entries), options)
    }

    connect() {
        this.intersectionObserver.observe(this.paginationTarget)
    }

    disconnect() {
        this.intersectionObserver.unobserve(this.paginationTarget)
    }

    processIntersectionEntries(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadMore()
            }
        })
    }

    loadMore() {
        let next_page = this.paginationTarget.querySelector("a[rel='next']")
        if (next_page == null) { return }
        let url = next_page.href

        fetch(url, {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            this.entriesTarget.insertAdjacentHTML('beforeend', data.entries)
            this.paginationTarget.innerHTML = data.pagination

        })
        .catch((error) => {
            console.log('error:', error);
        });       
    }
}