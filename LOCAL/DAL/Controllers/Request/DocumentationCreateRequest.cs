namespace DAL.Controllers.Request;

public class DocumentationCreateRequest {

    public Guid CustomerId { get; set; }

    public string? IdCard { get; set; }

    public string? IdTax { get; set; }
}