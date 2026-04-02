/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

self.addEventListener('push', event => {
  const data = event.data?.json() ?? { title: '우라주 챌린지', body: '새 알림이 있어요' }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: data.tag ?? 'default',
      renotify: true,
      data: { url: '/' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return (client as WindowClient).focus()
      }
      return self.clients.openWindow('/')
    })
  )
})
