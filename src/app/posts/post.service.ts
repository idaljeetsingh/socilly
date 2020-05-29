import {Post} from './post.model';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private API_BASE_URL = environment.API_BASE_URL;
  constructor(private http: HttpClient) {
  }

  getPosts() {
    // console.log();
    this.http
      .get<{message: string, posts: any}>(`${this.API_BASE_URL}/posts`)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string, data: object}>(`${this.API_BASE_URL}/posts`, post)
      .subscribe( (responseData) => {
        console.log(responseData.message);
        console.log(responseData.data);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
  deletePost(postId: string) {
    this.http
      .delete(`${this.API_BASE_URL}/posts/${postId}`)
      .subscribe(() => {
        console.log('Post Deleted');
      });
  }
}
