import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  QueryConstraint,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);

  // ===== READ =====
  getCollection<T>(path: string, ...constraints: QueryConstraint[]): Observable<T[]> {
    return new Observable<T[]>(subscriber => {
      try {
        const colRef = collection(this.firestore, path);
        const q = query(colRef, ...constraints);
        
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const data = snapshot.docs.map(doc => ({
              ...(doc.data() as any),
              key: doc.id
            } as T));
            console.log(`[FirestoreService] Recibidos ${data.length} documentos de "${path}"`);
            subscriber.next(data);
          },
          (error) => {
            console.error(`[FirestoreService] Error en colección "${path}":`, error);
            subscriber.error(error);
          }
        );
        return () => unsubscribe();
      } catch (error) {
        subscriber.error(error);
        return () => {};
      }
    });
  }

  getDocument<T>(path: string, id: string): Observable<T | undefined> {
    return new Observable<T | undefined>(subscriber => {
      const docRef = doc(this.firestore, path, id);
      const unsubscribe = onSnapshot(docRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            subscriber.next({ ...(snapshot.data() as any), key: snapshot.id } as T);
          } else {
            subscriber.next(undefined);
          }
        },
        (error) => subscriber.error(error)
      );
      return () => unsubscribe();
    });
  }

  // ===== CREATE =====
  async addDocument<T extends Record<string, any>>(path: string, data: T): Promise<string> {
    const colRef = collection(this.firestore, path);
    const cleaned = this.cleanData(data);
    const docRef = await addDoc(colRef, cleaned);
    return docRef.id;
  }

  // ===== UPDATE =====
  async updateDocument<T extends Record<string, any>>(path: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, path, id);
    const cleaned = this.cleanData(data);
    await updateDoc(docRef, cleaned);
  }

  // ===== DELETE =====
  async deleteDocument(path: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, path, id);
    await deleteDoc(docRef);
  }

  // ===== HELPERS =====
  orderByField(field: string, direction: 'asc' | 'desc' = 'asc') {
    return orderBy(field, direction);
  }

  whereField(field: string, op: any, value: any) {
    return where(field, op, value);
  }

  private cleanData(data: any): Record<string, any> {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      // Excluimos 'key', 'id' y valores undefined para evitar ensuciar Firestore
      if (key !== 'id' && key !== 'key' && data[key] !== undefined) {
        cleaned[key] = data[key];
      }
    }
    return cleaned;
  }
}
