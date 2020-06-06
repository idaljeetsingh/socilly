import {Post} from './post.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {log} from 'util';
import {Router} from '@angular/router';
import {Form} from '@angular/forms';


@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {
    // console.log();
    this.http
      .get<{ message: string, posts: any }>(`${this.API_BASE_URL}/posts`)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
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

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string, data: { _id: string, title: string, content: string, imagePath: string } }>(
        `${this.API_BASE_URL}/posts`,
        postData
      )
      .subscribe((responseData) => {
        // @ts-ignore
        const post: Post = {id: responseData.data._id, title, content, imagePath: responseData.data.imagePath};
        console.log(responseData.message);
        console.log(responseData.data);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete(`${this.API_BASE_URL}/posts/${postId}`)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`${this.API_BASE_URL}/posts/${id}`);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id, title, content, imagePath: image};
    }
    this.http
      .put(`${this.API_BASE_URL}/posts/${id}`, postData)
      .subscribe(response => this.router.navigate(['/']));
  }
}
