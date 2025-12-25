namespace backend.DTOs.Category;

public class CategoryQuery
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Name { get; set; }

}