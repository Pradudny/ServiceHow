import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('authToken');
  const cloned = req.clone({
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return next(cloned);
};