package pl.edu.pwr.news.dto;

public class TopHeadlinesRequestDto {
    int userId;
    public String category;
    public String q;
    public Integer pageSize;
    public Integer page;

    public TopHeadlinesRequestDto() {
    }

    public TopHeadlinesRequestDto(int userId, String category, String q, String lang, Integer pageSize, Integer page) {
        this.userId = userId;
        this.category = category;
        this.q = q;
        this.pageSize = pageSize;
        this.page = page;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
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