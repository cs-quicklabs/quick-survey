require "application_system_test_case"

class TelephonicTest < ApplicationSystemTestCase
  setup do
    @user = users(:telephonic_screener)
    sign_in @user
  end

  test "telephone_screener can see telephone screening list" do
    visit telephonic_url
    assert_selector "div#screening-tabs", text: "Telephonic"
    assert_text "Telephonic Screening"
  end

  test "everyone can see vendor screening list" do
    visit vendor_url
    assert_selector "div#screening-tabs", text: "Vendor"
    assert_text "Vendor Screening"
  end
end
