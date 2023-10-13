require "application_system_test_case"

class FoldersTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    @space = Space.all.active.includes(:folders).where.not(folders: { id: nil }).first
    @folder = @space.folders.where(user_id: @user.id).first
    sign_in @user
  end

  def page_url
    space_folders_url(script_name: "/#{@account.id}", space_id: @space)
  end

  def folders_page_url
    space_folder_url(script_name: "/#{@account.id}", space_id: @space.id, id: @folder.id)
  end

  test "can show index if logged in" do
    visit page_url
    take_screenshot
    assert_text @space.title
    assert_text "Add New Folder"
  end

  test "can not show index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can show folder detail page" do
    visit page_url
    within "div#folders" do
      page.execute_script("arguments[0].click();", find("a", text: @folder.title))
    end
    within "div#folder-header" do
      assert_selector "h1", text: @folder.title
    end
    take_screenshot
  end

  test "can create a new folder" do
    visit page_url
    click_on "Add New Folder"
    fill_in "folder_title", with: "Folder"
    click_on "Save"
    take_screenshot
    assert_selector "p.notice", text: "Folder was created successfully."
  end

  test "can not create with empty title " do
    visit page_url
    click_on "Add New Folder"
    assert_selector "h1", text: "Add New Folder"
    click_on "Save"
    take_screenshot
    assert_selector "h1", text: "Add New Folder"
    assert_selector "div#error_explanation", text: "Title can't be blank"
  end

  test "can edit a folder" do
    visit folders_page_url
    within "#folder-header" do
      find("button", id: "folder-menu").click
      click_on "Edit"
    end
    assert_selector "h1", text: "Edit Folder"
    fill_in "folder_title", with: "Folder"
    click_on "Update"
    assert_selector "p.notice", text: "Folder was updated successfully."
  end

  test "can not edit a folder with invalid name" do
    visit folders_page_url
    within "#folder-header" do
      find("button", id: "folder-menu").click
      click_on "Edit"
    end
    assert_selector "h1", text: "Edit Folder"
    fill_in "folder_title", with: ""
    click_on "Update"
    assert_selector "div#error_explanation", text: "Title can't be blank"
  end

  test "can delete folder" do
    visit folders_page_url
    within "#folder-header" do
      find("button", id: "folder-menu").click
      page.accept_confirm do
        click_on "Delete"
      end
    end
    take_screenshot
    assert_selector "p.notice", text: "Folder was removed successfully."
  end
end
