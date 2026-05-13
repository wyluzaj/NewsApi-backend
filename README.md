Backend News App

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

        Wymagane: userId, pageSize (20-100), page (od 1).

        Jeśli parametry wyszukiwania są puste, system użyje słów kluczowych i języka użytkownika z bazy.

        Można używać języka polskiego (pl).

        Reszta parametrów zgodnie z dokumentacją Everything.

    GET /api/news/search/top-headlines

        Wymagane: userId, pageSize (20-100), page (od 1).

        Jeśli parametry są puste, system użyje pierwszego słowa kluczowego użytkownika.

        Język: Jeśli użytkownik ma en, szuka po angielsku. W innym przypadku szuka we wszystkich językach.

        Reszta parametrów zgodnie z dokumentacją Top Headlines.

Ważne informacje

    Wymagania: Każdy użytkownik w bazie musi mieć przypisane przynajmniej jedno słowo kluczowe, aby zapytania do NewsApi mogły zostać poprawnie sformułowane.

    Klucz API: Klucz do NewsApi należy skonfigurować w pliku application.properties.

    Dokumentacja zewnętrzna: Szczegółowe zasady działania filtrów (np. sortBy, sources) znajdziesz na stronie: NewsApi Documentation.
