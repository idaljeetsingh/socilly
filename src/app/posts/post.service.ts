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
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&pagenum=${currentPage}`;
    this.http
      .get<{ message: string, posts: any, maxPosts: number }>(`${this.API_BASE_URL}/posts${queryParams}`)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPost: postData.maxPosts
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPost
        });
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
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(`${this.API_BASE_URL}/posts/${postId}`);
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string , creator: string}>(`${this.API_BASE_URL}/posts/${id}`);
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
      postData = {id, title, content, imagePath: image, creator: null};
    }
    this.http
      .put(`${this.API_BASE_URL}/posts/${id}`, postData)
      .subscribe(response => this.router.navigate(['/']));
  }
}
