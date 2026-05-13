package pl.edu.pwr.news.dto;

public class EverythingRequestDto {
    public int userId;
    public String q;
    public String sources;
    public String domains;
    public String excludeDomains;
    public String from;
    public String to;
    public String language;
    public String sortBy;
    public Integer pageSize;
    public Integer page;

    public EverythingRequestDto() {
    }

    public EverythingRequestDto(
            int userId,
            String q,
            String sources,
            String domains,
            String excludeDomains,
            String from,
            String to,
            String language,
            String sortBy,
            Integer pageSize,
            Integer page
    ) {
        this.userId = userId;
        this.q = q;
        this.sources = sources;
        this.domains = domains;
        this.excludeDomains = excludeDomains;
        this.from = from;
        this.to = to;
        this.language = language;
        this.sortBy = sortBy;
        this.pageSize = pageSize;
        this.page = page;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public String getSources() {
        return sources;
    }

    public void setSources(String sources) {
        this.sources = sources;
    }

    public String getDomains() {
        return domains;
    }

    public void setDomains(String domains) {
        this.domains = domains;
    }

    public String getExcludeDomains() {
        return excludeDomains;
    }

    public void setExcludeDomains(String excludeDomains) {
        this.excludeDomains = excludeDomains;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }
}