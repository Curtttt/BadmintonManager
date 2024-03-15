import { Injectable, inject } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDocs, getFirestore, query, where, WhereFilterOp, updateDoc, onSnapshot, setDoc, addDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class crudService {
  firestore: Firestore = inject(Firestore);
  db = getFirestore();

  private changeSource = new BehaviorSubject<any>(null);
  changeListener = this.changeSource.asObservable();

  private infoSource = new BehaviorSubject<any>(null);
  currentInfo = this.infoSource.asObservable();

  clearChange() { this.changeSource.next(null); }
  sendInfo(info: any) { this.infoSource.next(info); }

  async createDocument(collection_: string, data: any, id_?: any, component_?: string) {
    let collectionRef = collection(this.db, collection_);
    if (id_ == undefined)
      await addDoc(collectionRef, data);
    else await setDoc(doc(this.db, collection_, id_), data);

    let unsub = onSnapshot(collectionRef, (docs) => {
      let arr: any = [];
      docs.forEach(doc => arr.push(doc.data()));
      this.changeSource.next({ component: component_, target: arr });
    });
    return () => unsub();
  }

  async getCollection(collection_: any) {
    let lst: any = [];
    let querySnapshot = await getDocs(collection(this.db, collection_));
    querySnapshot.forEach((doc) => {
      let data = { id: doc.id, ...doc.data() };
      lst.push(data);
    });
    return lst;
  }

  async findInCollection(_collection: string, field: string, equation: WhereFilterOp, value: any) {
    if (field == "id") {
      let docRef = doc(this.db, _collection, value);
      let docSnap = await getDoc(docRef);
      return docSnap.data();
      }
      else {
        let ref = collection(this.db, _collection);
        let query_ = query(ref, where(field, equation, value));
        let lst: any = [];
        let querySnapshot = await getDocs(query_);
        querySnapshot.forEach((doc) => {
          let data = { id: doc.id, ...doc.data() };
          lst.push(data);
        });
        return lst;
      }

    }

    async updateDocument(collection_: string, id: string, data: any, component_: string) {
      let Doc = doc(this.firestore, collection_, id);
      await updateDoc(Doc, data);

      let unsub = onSnapshot(Doc, (doc) => {
        this.changeSource.next({ component: component_, target: { id: doc.id, ...doc.data() } });
      });
      return () => unsub();
    }

    async deleteDocument(collection_: string, id: string, component_: string) {
      let Doc = doc(this.firestore, collection_, id);
      await deleteDoc(Doc);

      let unsub = onSnapshot(Doc, (doc) => {
        this.changeSource.next({ component: component_, target: { id: doc.id, ...doc.data() } });
      });
      return () => unsub();
    }

  }
