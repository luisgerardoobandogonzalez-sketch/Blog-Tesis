import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Tag {
    id: string;
    name: string;
    count: number; // Usage count for popularity
}

@Injectable({
    providedIn: 'root'
})
export class TagService {
    private initialTags: Tag[] = [
        { id: '1', name: 'angular', count: 15 },
        { id: '2', name: 'ionic', count: 12 },
        { id: '3', name: 'typescript', count: 10 },
        { id: '4', name: 'javascript', count: 8 },
        { id: '5', name: 'programming', count: 20 },
        { id: '6', name: 'design', count: 5 },
        { id: '7', name: 'ui/ux', count: 7 },
        { id: '8', name: 'career', count: 3 },
        { id: '9', name: 'thesis', count: 2 },
        { id: '10', name: 'university', count: 6 }
    ];

    private tagsSubject = new BehaviorSubject<Tag[]>(this.initialTags);

    constructor() {
        // Load from localStorage if available
        const savedTags = localStorage.getItem('tags');
        if (savedTags) {
            this.tagsSubject.next(JSON.parse(savedTags));
        }
    }

    getTags(): Observable<Tag[]> {
        return this.tagsSubject.asObservable();
    }

    getPopularTags(limit: number = 5): Observable<Tag[]> {
        return this.tagsSubject.pipe(
            map(tags => [...tags].sort((a, b) => b.count - a.count).slice(0, limit))
        );
    }

    searchTags(query: string): Observable<Tag[]> {
        const lowerQuery = query.toLowerCase();
        return this.tagsSubject.pipe(
            map(tags => tags.filter(t => t.name.toLowerCase().includes(lowerQuery)))
        );
    }

    addTag(name: string): void {
        const currentTags = this.tagsSubject.value;
        const existingTag = currentTags.find(t => t.name.toLowerCase() === name.toLowerCase());

        if (existingTag) {
            existingTag.count++;
        } else {
            const newTag: Tag = {
                id: Date.now().toString(),
                name: name.toLowerCase(),
                count: 1
            };
            currentTags.push(newTag);
        }

        this.updateTags(currentTags);
    }

    // Call this when a blog is created with a list of tags
    processTags(tagNames: string[]): void {
        tagNames.forEach(name => this.addTag(name));
    }

    private updateTags(tags: Tag[]): void {
        this.tagsSubject.next(tags);
        localStorage.setItem('tags', JSON.stringify(tags));
    }
}
