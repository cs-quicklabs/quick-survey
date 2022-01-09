require "application_system_test_case"

class HrTest < ApplicationSystemTestCase
  setup do
    @user = users(:hr)
    sign_in @user
  end

  test "hr can see hr screening list" do
    sign_in @user
    visit hr_url
    assert_selector "div#screening-tabs", text: "HR"
    assert_text "HR Screening"
  end
  test "everyone can see vendor screening list" do
    visit vendor_url
    assert_selector "div#screening-tabs", text: "Vendor"
    assert_text "Vendor Screening"
  end
end
