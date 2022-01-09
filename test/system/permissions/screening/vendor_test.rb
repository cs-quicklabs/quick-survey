require "application_system_test_case"

class VendorTest < ApplicationSystemTestCase
  setup do
    @user = users(:regular)
    sign_in @user
  end

  test "everyone can see vendor screening list" do
    sign_in @user
    visit vendor_url
    assert_selector "div#screening-tabs", text: "Vendor"
    assert_text "Vendor Screening"
  end
end
