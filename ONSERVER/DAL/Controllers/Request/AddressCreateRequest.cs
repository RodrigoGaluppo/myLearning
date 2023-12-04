namespace DAL.Controllers.Request;

public class AddressCreateRequest {
    public Guid? CustomerId { get; set; }
    public string? Street { get; set; }

    public string? Number { get; set; }

    public string? PostalCode { get; set; }

    public string? Parish { get; set; }

    public string? City { get; set; }
}