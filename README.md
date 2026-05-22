

## Uruchamianie aplikacji przez Docker Compose

Projekt można uruchomić za pomocą Docker Compose. W ten sposób uruchamiane są wszystkie potrzebne elementy aplikacji:

- baza danych MySQL,
- backend Spring Boot,
- frontend React/Vite.

Wymagania:

- zainstalowany Docker,
- uruchomiony Docker Desktop,
- wolne porty:
- `8080` dla backendu, http://localhost:8080
- `5173` dla frontendu, http://localhost:5173
- `3307` dla bazy danych MySQL.

Swagger UI dostępny pod http://localhost:8080/swagger-ui/index.html

Aby uruchomić aplikację, w głównym folderze projektu wykonaj:

`
docker compose up --build
`

Aby zatrzymać uruchomione kontenery, użyj:

`
docker compose down
`

To polecenie zatrzymuje kontenery, ale nie usuwa danych zapisanych w bazie.

Jeśli chcesz zatrzymać kontenery i całkowicie wyczyścić bazę danych, użyj:

`
docker compose down -v
`
## Frontend

Frontend aplikacji znajduje się w folderze:

`news-frontend`

Został wykonany w technologii React z użyciem narzędzia Vite. Aplikacja frontendowa odpowiada za wyświetlanie interfejsu użytkownika oraz komunikację z backendem przez zapytania API.

Frontend zawiera:

- stronę logowania,
- stronę rejestracji,
- stronę główną z listą artykułów,
- filtrowanie i paginację artykułów,
- panel użytkownika,
- edycję danych użytkownika,
- zmianę hasła,
- zarządzanie preferencjami użytkownika, takimi jak języki i słowa kluczowe.

Po zalogowaniu użytkownik widzi artykuły pobierane z backendu. Wyniki są dopasowywane do zapisanych preferencji użytkownika, czyli wybranych języków oraz słów kluczowych.

## Backend News App

Aplikacja integrująca bazę danych ze słowami kluczowymi użytkowników z zewnętrznym API NewsApi.
Funkcjonalności

    Zarządzanie danymi (CRUD): Pełna obsługa obiektów w bazie danych (Użytkownicy, Słowa Kluczowe, Języki).

    Integracja z NewsApi: Pobieranie artykułów na podstawie preferencji zapisanych w bazie lub parametrów przesłanych ręcznie.

Endpointy Newsów
Pobieranie na podstawie profilu użytkownika

Te zapytania automatycznie pobierają dane o słowach kluczowych i języku z bazy danych na podstawie podanego ID.

    GET /api/news/user/{id}

        Wymaga ID użytkownika.

        Wyszukuje artykuły pasujące do wszystkich słów kluczowych i języka użytkownika.

        Wyniki sortowane po dacie publikacji.

    GET /api/news/user/{id}/popular

        To samo co wyżej, ale wyniki są sortowane według popularności artykułów.

    GET /api/news/user/{id}/top-headlines

        Wymaga ID użytkownika.

        Używa tylko pierwszego słowa kluczowego zapisanego u użytkownika.

        Logika języka: Jeśli użytkownik ma ustawiony język en, wyszukuje tylko po angielsku. Jeśli ma ustawiony inny język, filtr języka jest pomijany (wyszukuje we wszystkich językach), ponieważ NewsAPI obsługuje w nagłówkach głównie język angielski.

Wyszukiwarki (Search)

Pozwalają na ręczne sterowanie filtrami. Jeśli opcjonalne pola zostaną puste, system użyje danych z profilu użytkownika.

    GET /api/news/search/everything

        Wymagane: userId.

        Jeśli parametry wyszukiwania są puste, system użyje słów kluczowych.

        Można używać języka polskiego (pl).

        Reszta parametrów zgodnie z dokumentacją Everything. https://newsapi.org/docs/endpoints/everything

    GET /api/news/search/top-headlines

        Wymagane: userId.

        Jeśli parametry są puste, system użyje pierwszego słowa kluczowego użytkownika.

        Język: Jeśli użytkownik ma en, szuka po angielsku. W innym przypadku szuka we wszystkich językach.

        Reszta parametrów zgodnie z dokumentacją Top Headlines. https://newsapi.org/docs/endpoints/top-headlines

Ważne informacje

    Wymagania: Każdy użytkownik w bazie musi mieć przypisane przynajmniej jedno słowo kluczowe, aby zapytania do NewsApi mogły zostać poprawnie sformułowane.

    Klucz API: Klucz do NewsApi należy skonfigurować w pliku application.properties.

    Dokumentacja zewnętrzna: Szczegółowe zasady działania filtrów (np. sortBy, sources) znajdziesz na stronie: NewsApi Documentation. https://newsapi.org/docs/endpoints



Dostęp do większości endpointów wymaga tokena JWT przesyłanego w nagłówku:

Authorization: Bearer <twój_token>
Endpointy publiczne:

    POST /api/auth/register – Rejestracja użytkownika.

    Wymagane: username, password, keyword, language (kod języka, np. pl).

    Podczas rejestracji automatycznie przypisywane jest pierwsze słowo kluczowe i język.

    POST /api/auth/login – Logowanie użytkownika.

    Zwraca: token oraz userId.
