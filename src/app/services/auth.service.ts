import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isUserAuthenticated$: Observable<boolean>;
  public isUserAuthenticatedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth,
    private db: AngularFirestore) { 
      this.usersCollection = db.collection('users');
      this.isUserAuthenticated$ = auth.user.pipe(
        map(user => !!user)
        );
      this.isUserAuthenticatedWithDelay$ = this.isUserAuthenticated$.pipe(
        delay(1000)
      );
    }

  public async createUser(userData: IUser){
    if(!userData.password){
      throw new Error("Password not provided!");
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    );

    if(!userCred.user){
      throw new Error("User can't be found");
    }

    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await userCred.user.updateProfile({
      displayName: userData.name
    });
  }
}
